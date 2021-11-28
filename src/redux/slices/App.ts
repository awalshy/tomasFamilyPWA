import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import firebase from 'firebase'
import { collecs } from 'src/firebase/api'
import { TUser } from 'src/types/User'
import { IAppState, TModalState } from 'src/types/App'
import { RootState } from 'src/redux/store'
import { toast } from 'react-toastify'
import { getFirebaseError } from 'src/firebase/errors'

const initialState: IAppState = {
  ready: false,
  user: undefined,
  loggedIn: false,
  modal: null,
  loading: false,
  error: '',
}

export const signInUser = createAsyncThunk(
  'app/loginUser',
  async ({ email, password }: { email: string, password: string }) => {
    const fireUser = await firebase.auth().signInWithEmailAndPassword(email, password)
    // Get User In Firebase
    if (!fireUser || !fireUser.user) {
      return
    }
    const user = await firebase.firestore().collection(collecs.users).doc(fireUser.user.uid).get()
    const data = user.data()
    if (!data) {
      throw Error('No User Data')
    }
    const familyRef: firebase.firestore.DocumentReference = data.family
    const u = {
      id: fireUser.user.uid,
      email: fireUser.user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      familyId: familyRef.id
    } as TUser
    return u
  }
)

export const signUpUser = createAsyncThunk(
  'app/userSignUp',
  async ({
    email, password
  }: { email: string, password: string }) => {
    // Register User
    await firebase.auth()
      .createUserWithEmailAndPassword(email, password)
  }
)

export const signUpUserDetails = createAsyncThunk(
  'app/userSignUpDetails',
  async({ firstName, lastName }: { firstName: string, lastName: string }) => {
    const fireUser = firebase.auth().currentUser
    if (!fireUser)
      throw Error('Not logged In')
    await firebase.firestore().collection(collecs.users).doc(fireUser.uid).set({
      firstName,
      lastName
    })
  }
)

export const signUpUserFamily = createAsyncThunk(
  'app/userSignUpFamily',
  async({ familyCode }: { familyCode: string }) => {
    // Check family Code
    const docs = await firebase.firestore().collection(collecs.families).where('code', '==', familyCode).get()
    if (docs.docs.length <= 0) {
      throw Error('No family with this code')
    }
    // Get family
    const family = docs.docs[0]
    const familyId = family.id

    // Register familyId in user
    const fireUser = firebase.auth().currentUser
    if (!fireUser) throw Error('No FireUser')
    const user = await firebase.firestore().collection(collecs.users).doc(fireUser.uid).get()
    await user.ref.update({
      family: family.ref
    })

    // Register in Family
    const members = family.get('members')
    family.ref.update({
      members: [...members, user.ref]
    })

    // Add to family Conversation
    const conv = await firebase.firestore().collection(collecs.convs).doc(family.get('convId')).get()
    const convMembers = conv.get('members')
    conv.ref.update({
      members: [...convMembers, user.ref]
    })

    // return User
    return {
      id: user.id,
      firstName: user.get('firstName'),
      lastName: user.get('lastName'),
      familyId,
      email: fireUser.email
    } as TUser
  }
)

export const loadUser = createAsyncThunk(
  'app/loadUser',
  async ({ uid, email }: { email: string, uid: string }) => {
    const user = await firebase.firestore().collection(collecs.users).doc(uid).get()
    const data = user.data()
    if (!data) {
      console.log('LOAD USER FAILED')
      return
    }
    const familyRef: firebase.firestore.DocumentReference = data.family
    return {
      id: uid,
      email,
      firstName: data.firstName,
      lastName: data.lastName,
      familyId: familyRef.id
    } as TUser
  }
)

export const signOutUser = createAsyncThunk(
  'app/SignOut',
  async () => {
    await firebase.auth().signOut()
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appReady(state) {
      state.ready = true
    },
    updateUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload
      state.loggedIn = true
    },
    openModal(state, action: PayloadAction<TModalState>) {
      state.modal = action.payload
    },
    closeModal(state) {
      state.modal = null
    },
  },
  extraReducers: builder => {
    builder.addCase(signUpUser.pending, (state, _action) => {
      state.loading = true
      if (state.error !== '')
        state.error = ''
    })
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Error'
      toast.error(getFirebaseError(action.error.code))
    })
    builder.addCase(signUpUser.fulfilled, (state, _action) => {
      state.loading = false
    })
    builder.addCase(signUpUserDetails.pending, (state, _action) => {
      state.loading = true
      if (state.error !== '')
        state.error = ''
    })
    builder.addCase(signUpUserDetails.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Error'
      toast.error(getFirebaseError(action.error.code))
    })
    builder.addCase(signUpUserDetails.fulfilled, (state, _action) => {
      state.loading = false
    })
    builder.addCase(signUpUserFamily.pending, (state, _action) => {
      state.loading = true
      if (state.error !== '')
        state.error = ''
    })
    builder.addCase(signUpUserFamily.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Error'
      toast.error(getFirebaseError(action.error.code))
    })
    builder.addCase(signUpUserFamily.fulfilled, (state, action) => {
      state.loading = false
      state.loggedIn = true
      state.user = action.payload
      toast.success('Compte créé avec succès !')
    })
    builder.addCase(signInUser.pending, (state, _action) => {
      state.loading = true
    })
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.loading = false
      state.loggedIn = true
      state.user = action.payload
      toast.success(action.payload?.firstName ? `Bonjour ${action.payload?.firstName}` : 'Connecté !')
    })
    builder.addCase(signInUser.rejected, (state, action) => {
      state.error = action.error.message || 'Error'
      state.loading = false
      toast.error(getFirebaseError(action.error.code))
    })
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
      state.loggedIn = true
    })
    builder.addCase(signOutUser.pending, (state, _action) => {
      state.error = ''
      state.loading = true
    })
    builder.addCase(signOutUser.fulfilled, (state, _action) => {
      state.loading = false
      state.loggedIn = false
      state.user = undefined
      toast.success('Déconnecté !')
    })
  }
})

export const {
  appReady,
  updateUser,
  closeModal,
  openModal
} = appSlice.actions

export const selectUserId = (state: RootState) => state.app.user?.id
export const selectUser = (state: RootState) => state.app.user
export const selectUserFamilyId = (state: RootState) => state.app.user?.familyId
export const selectUserLoggedIn = (state: RootState) => state.app.loggedIn
export const selectModal = (state: RootState) => state.app.modal
export const selectAppLoading = (state: RootState) => state.app.loading

export default appSlice.reducer