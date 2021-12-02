import { createTheme, ThemeOptions, ThemeProvider } from '@material-ui/core';
import firebase from 'firebase';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';



import ModalController from './components/app/ModalController';



import { loadUser } from './redux/slices/App';
import store from './redux/store';



import Error404 from './routes/404';
import Call from './routes/Call';
import Conversation from './routes/Conversation';
import Home from './routes/Home';
import Profile from './routes/Profile';
import Register from './routes/Register';
import SignIn from './routes/SignIn';



import './App.css';
import firebaseConfig from './config/firebase-config.json';


const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#133c6d',
      dark: '#001741',
      light: '#48669c',
      contrastText: '#e3eaeb'
    },
    secondary: {
      main: '#afd3ab',
      light: '#e1ffdd',
      dark: '#7fa27c',
      contrastText: '#2d2d2d'
    },

  },
}

function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
    console.warn('Enabling persistence')
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch((err) => console.error('Auth Persistence Error', err))
    firebase
      .firestore()
      .enablePersistence()
      .catch((err) => console.error('Firestore Persistence error', err))
    firebase.messaging().onMessage((payload) => {
      toast(`Nouveau message: ${payload.notification.title}`)
    })
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && window.location.pathname !== '/Register') {
        store.dispatch(
          loadUser({
            email: user.email || '',
            uid: user.uid,
          })
        )
      }
    })
    if ('Notification' in window && Notification.permission !== 'granted')
      Notification.requestPermission().then(permission => {
        if (permission === 'denied')
          toast.error('Les notifications sont bloquées')
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
            <Route path="/Register" element={<Register />} />
            <Route path="/Conversation/:id" element={<Conversation />} />
          </Routes>
        </BrowserRouter>
        <ModalController />
        <ToastContainer
          autoClose={4000}
          pauseOnHover={false}
          draggableDirection="x"
          limit={3}
          position="bottom-right"
          theme="colored"
          hideProgressBar
        />
      </ThemeProvider>
    </Provider>
  )
}

export default App