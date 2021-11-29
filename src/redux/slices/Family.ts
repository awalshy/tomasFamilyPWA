import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'

import { RootState } from 'src/redux/store'

import API from 'src/firebase/api'

import { TFamily } from 'src/types/Family'
import { TUser } from 'src/types/User'

const membersEntity = createEntityAdapter<TUser>({
  selectId: (m) => m.id,
})

// Async Thunks
export const loadFamily = createAsyncThunk('family/loadFamily', async (familyId: string) => {
  const api = new API()
  const family = await api.families.getFamilyById(familyId)
  if (!family) return
  const members = await api.families.getFamilyMembers(family.members, familyId)
  return { family, members }
})

export const removeMember = createAsyncThunk('family/removeMember', async (member: TUser) => {
  const api = new API()
  await api.families.removeMember(member)
  return member.id
})

const initialState = membersEntity.getInitialState({
  family: undefined,
} as {
  family: TFamily | undefined
})

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadFamily.fulfilled, (state, action) => {
      if (!action.payload) return
      state.family = action.payload.family
      membersEntity.upsertMany(state, action.payload.members)
    })
    builder.addCase(removeMember.fulfilled, (state, action) => {
      membersEntity.removeOne(state, action.payload)
    })
  },
})

// Reducer
export default familySlice.reducer

// Selectors
export const { selectAll: selectAllMembers, selectById: selectMemberById } =
  membersEntity.getSelectors((state: RootState) => state.family)
export const selectFamilyNbMembers = (state: RootState) => selectAllMembers(state).length
export const selectFamilyCode = (state: RootState) => state.family.family?.code
export const selectFamilyName = (state: RootState) => state.family.family?.name
