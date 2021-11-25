import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit'
import API from '../../firebase/api'
import { TMessage } from '../../types/Message'
import { RootState } from '../store'

// Adapter
const messagesAdapter = createEntityAdapter<TMessage>({
  selectId: m => m.id,
  sortComparer: (a, b) => b.date.getTime() - a.date.getTime()
})

// Async Thunks
export const addMessage = createAsyncThunk(
  'messages/addMessage',
  async ({ message, convId }: { message: TMessage, convId: string }) => {
    const api = new API()
    const msg = await api.messages.sendMessage(convId, message)
    return msg
  }
)

export const getMessagesInConv = createAsyncThunk(
  'messages/getConv',
  async (convId: string) => {
    const api = new API()
    const msgs = await api.messages.getMessagesInConv(convId)
    return msgs
  }
)

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (message: TMessage) => {
    const api = new API()
    const m = await api.messages.sendMessage(message.conversationId, message)
    return m
  }
)

const initialState = messagesAdapter.getInitialState()

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addMessage.fulfilled, (state, action) => {
      messagesAdapter.addOne(state, action.payload)
    })
    builder.addCase(getMessagesInConv.fulfilled, (state, action) => {
      messagesAdapter.upsertMany(state, action.payload)
    })
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      messagesAdapter.addOne(state, action)
    })
  }
})

// Reducers
export default messageSlice.reducer

// Selectors
export const {
  selectAll: selectAllMessages
} = messagesAdapter.getSelectors<RootState>(state => state.messages)

export const selectMessagesOfConv = createSelector(
  [selectAllMessages, (_state: RootState, convId: string) => convId],
  (msgs, convId) => msgs.filter(m => m.conversationId === convId)
)