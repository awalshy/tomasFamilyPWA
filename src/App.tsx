import React from 'react';
import './App.css';
import { Provider } from 'react-redux'
import store from 'redux/store'
import { createTheme, ThemeOptions, ThemeProvider } from '@material-ui/core';
import ModalController from 'components/app/ModalController';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import firebaseConfig from 'config/firebase-config.json'
import firebase from 'firebase'
import Home from './routes/Home';
import SignIn from './routes/SignIn';
import Error404 from './routes/404';
import Call from './routes/Call';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#133c6d'
    },
  }
}

function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    firebase.firestore().enablePersistence()
  }
  return (
    <Provider store={store}>
      <ThemeProvider theme={createTheme(themeOptions)}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/Call" element={<Call />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
        <ModalController />
      </ThemeProvider>
    </Provider>
  )
}

export default App;