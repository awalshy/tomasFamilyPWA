import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import firebase from 'firebase'
import { collecs } from 'src/firebase/api'
import { TUser } from 'src/types/User'
import { IAppState, TModalState } from 'src/types/App'
import { RootState } from 'src/redux/store'

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
    email, password, firstName, lastName, familyCode
  }: { email: string, password: string, firstName: string, lastName: string, familyCode: string }) => {
    // Check family Code
    const docs = await firebase.firestore().collection(collecs.families).where('code', '==', familyCode).get()
    if (docs.docs.length <= 0) {
      console.log('NO FAMILIES')
      return
    }
    // Get family
    const familyId = docs.docs[0].id
    // Register User
    const fireUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
    // Save User Info to DB
    if (!fireUser || !fireUser.user) {
      console.log('No FireUser')
      return
    }
    await firebase.firestore().collection(collecs.users).doc(fireUser.user.uid).set({
      firstName,
      lastName,
      familyId
    })
    return {
      id: fireUser.user.uid,
      email: fireUser.user.email,
      firstName,
      lastName,
      familyId
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
    }
  },
  extraReducers: builder => {
    builder.addCase(signInUser.pending, (state, _action) => {
      state.loading = true
    })
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.loading = false
      state.loggedIn = true
      state.user = action.payload
    })
    builder.addCase(signInUser.rejected, (state, action) => {
      state.error = action.error.message || 'Error'
      state.loading = false
    })
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.loading = false
    })
    builder.addCase(signOutUser.pending, (state, _action) => {
      state.error = ''
      state.loading = true
    })
    builder.addCase(signOutUser.fulfilled, (state, _action) => {
      state.loading = false
      state.loggedIn = false
      state.user = undefined
    })
  }
})

export const {
  appReady,
  updateUser,
  closeModal,
  openModal,
} = appSlice.actions

export const selectUserId = (state: RootState) => state.app.user?.id
export const selectUser = (state: RootState) => state.app.user
export const selectUserFamilyId = (state: RootState) => state.app.user?.familyId
export const selectUserLoggedIn = (state: RootState) => state.app.loggedIn
export const selectModal = (state: RootState) => state.app.modal
export const selectAppLoading = (state: RootState) => state.app.loading

export default appSlice.reducer