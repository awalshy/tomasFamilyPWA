import React from 'react'

import { Provider } from 'react-redux'
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material'
import firebase from 'firebase'
import store from 'redux/store'

import ModalController from 'components/app/ModalController'

import firebaseConfig from 'config/firebase-config.json'
import type { AppProps } from 'next/app'

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#133c6d'
    },
  }
}

const theme = createTheme(themeOptions)

export default function MyApp({ Component, pageProps }: AppProps) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    //enable persistence
  }
  return <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <ModalController />
    </ThemeProvider>
  </Provider>
}

