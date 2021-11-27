import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit'
import API from '../../firebase/api'
import { TConversation } from '../../types/Conversation'
import { RootState } from '../store'

// Adapter
const convsAdapter = createEntityAdapter<TConversation>({
  selectId: c => c.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
})

// Async Thunks
export const loadConversation = createAsyncThunk(
  'convs/load',
  async (userId: string) => {
    const api = new API()
    const msg = await api.convs.getConvs(userId)
    return msg
  }
)

export const createConversation = createAsyncThunk(
  'convs/create',
  async (conv: TConversation) => {
    const api = new API()
    const newConv = await api.convs.createConv(conv.members, conv.name)
    return newConv
  }
)

const initialState = convsAdapter.getInitialState()

const convsSlice = createSlice({
  name: 'convs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadConversation.fulfilled, (state, action) => {
      convsAdapter.upsertMany(state, action.payload)
    })
    builder.addCase(createConversation.fulfilled, (state, action) => {
      convsAdapter.addOne(state, action.payload)
    })
  }
})

// Reducer
export default convsSlice.reducer

// Selectors
export const {
  selectAll: selectAllConvs,
  selectById: selectConvById
} = convsAdapter.getSelectors<RootState>(state => state.convs)