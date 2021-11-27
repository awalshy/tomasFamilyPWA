import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import API from '../../firebase/api'
import { TMessage } from '../../types/Message'
import { RootState } from '../store'

// Adapter
const messagesAdapter = createEntityAdapter<TMessage>({
  selectId: m => m.id,
  sortComparer: (a, b) => b.date - a.date
})

// Async Thunks
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
    const m = await api.messages.sendMessage(message)
    return m
  }
)

const initialState = messagesAdapter.getInitialState()

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<TMessage>) {
      messagesAdapter.addOne(state, action.payload)
    },
    // updateMessage(state, action: PayloadAction<TMessage>) {
    //   messagesAdapter.updateOne(state, action.payload)
    // },
    // deleteMessage(state, action: PayloadAction<TMessage>) {
    //   messagesAdapter.removeOne(state, action.payload.id)
    // }
  },
  extraReducers: builder => {
    builder.addCase(getMessagesInConv.fulfilled, (state, action) => {
      messagesAdapter.upsertMany(state, action.payload)
    })
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      messagesAdapter.addOne(state, action.payload)
    })
  }
})

// Actions
export const {
  addMessage
} = messageSlice.actions

// Reducers
export default messageSlice.reducer

// Selectors
export const {
  selectAll: selectAllMessages,
} = messagesAdapter.getSelectors<RootState>(state => state.messages)

export const selectMessagesOfConv = createSelector(
  [selectAllMessages, (_state: RootState, convId: string) => convId],
  (msgs, convId) => msgs.filter(m => m.conversationId === convId)
)