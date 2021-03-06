import { TUser } from './User'

export enum MODALS {
  UPLOAD_PICTURE = 'UPLOAD_PICTURE',
  EDIT_FAMILY = 'EDIT_FAMILY',
  PEAK_MEMBER = 'PEAK_MEMBER',
  CREATE_CONVERSATION = 'CREATE_CONVERSATION'
}

export type EntityState = {
  status: 'idle' | 'errored' | 'succeded' | 'loading'
  error: string
}

export interface TModalState {
  name: MODALS
  params: any
}

export interface IAppState {
  ready: boolean
  modal: null | TModalState
  user: undefined | TUser
  loggedIn: boolean
  loading: boolean
  error: string
  darkTheme: boolean
}
