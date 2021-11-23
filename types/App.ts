import { TUser } from "./User";

export enum MODALS {
  EDIT_FAMILY = 'EDIT_FAMILY',
}

export type EntityState = {
  status: 'idle' | 'errored' | 'succeded' | 'loading',
  error: string
}

export interface TModalState {
  name: MODALS,
  params: any
}

export interface IAppState {
  ready: boolean,
  modal: null | TModalState,
  user: undefined | TUser,
  loggedIn: boolean,
  loading: boolean,
  error: string
}