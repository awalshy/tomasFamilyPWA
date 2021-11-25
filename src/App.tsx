import './App.css';
import { Provider } from 'react-redux'
import store from './redux/store'
import { createTheme, ThemeOptions, ThemeProvider } from '@material-ui/core';
import ModalController from './components/app/ModalController';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import firebaseConfig from './config/firebase-config.json'
import firebase from 'firebase'
import Home from './routes/Home';
import SignIn from './routes/SignIn';
import Error404 from './routes/404';
import Call from './routes/Call';
import Profile from './routes/Profile';
import { useEffect } from 'react';
import { loadUser } from './redux/slices/App';

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
    console.warn('Enabling persistence')
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(err => console.error('Auth Persistence Error', err))
    firebase.firestore().enablePersistence().catch(err => console.error('Firestore Persistence error', err))
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        store.dispatch(loadUser({
          email: user.email || '',
          uid: user.uid
        }))
      }
    })
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={createTheme(themeOptions)}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/Call" element={<Call />} />
            <Route path="*" element={<Error404 />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <ModalController />
      </ThemeProvider>
    </Provider>
  )
}

export default App;
