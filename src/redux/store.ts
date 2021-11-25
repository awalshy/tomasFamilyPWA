import { configureStore } from "@reduxjs/toolkit"

// Reducers
import appReducer from './slices/App'
import messagesReducer from './slices/Messages'
import convsReducer from './slices/Conversations'
import familyReducer from './slices/Family'

const store = configureStore({
  reducer: {
    app: appReducer,
    messages: messagesReducer,
    convs: convsReducer,
    family: familyReducer
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch