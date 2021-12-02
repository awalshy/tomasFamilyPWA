import {
  Avatar,
  Button,
  Divider,
  Grid,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { UAParser } from 'ua-parser-js'

import Header from 'src/components/structure/Header'
import PageLayout from 'src/components/structure/PageLayout'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import {
  selectAppLoading,
  selectFamilyNbMembers,
  selectFamilyCode,
  selectFamilyName,
  selectUser,
  selectUserLoggedIn,
  selectAppTheme,
} from 'src/redux/selectors'
import { openModal, signOutUser, toggleTheme } from 'src/redux/slices/App'
import { loadFamily } from 'src/redux/slices/Family'

import { MODALS } from 'src/types/App'

function Profile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const parser = new UAParser(navigator.userAgent)

  const [showCode, setShowCode] = useState(false)
  const storageActive = localStorage.getItem('__activeNotif')
  const [active, setActive] = useState<boolean>(storageActive === 'true')

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const familyCode = useAppSelector(selectFamilyCode)
  const familyName = useAppSelector(selectFamilyName)
  const familyNbMembers = useAppSelector(selectFamilyNbMembers)
  const user = useAppSelector(selectUser)
  const loggedIn = useAppSelector(selectUserLoggedIn)
  const loading = useAppSelector(selectAppLoading)
  const dark = useAppSelector(selectAppTheme)

  useEffect(() => {
    if (!loggedIn || !user) navigate('/SignIn')
    if (!familyCode && user) dispatch(loadFamily(user.familyId))
  }, [loggedIn, navigate, user, dispatch, familyCode])

  const handleSignOut = () => {
    dispatch(signOutUser())
  }
  const handleShowCode = () => {
    setShowCode(true)
    setTimeout(() => setShowCode(false), 20000)
  }
  const handleRegister = async () => {
    if (!active) {
      if ('Notification' in window && Notification.permission === 'granted')
        new Notification('Les notifications sont activées !', {
          body: 'Les notifications sont désormais activées sur votre appareil. Quand vous utilisez l\'application elles appaitront sur le bas de votre écran. Quand l\'application est fermée, vous recevrez des notifications ici.'
        })
      localStorage.setItem('__activeNotif', 'true')
    } else {
      localStorage.setItem('__activeNotif', 'false')
    }
    setActive(!active)
  }
  const getDeviceName = () => {
    const device = parser.getDevice()
    const os = parser.getOS()
    const browser = parser.getBrowser()

    if (device.type === 'mobile') {
      return `Téléphone ${device.vendor + ' ' || ''}${os.name} ${os.version}`
    } else {
      return `Ordinateur ${device.vendor} - ${browser.name}`
    }
  }

  return (
    <PageLayout title="Profile">
      <Header title="Profile" imageSrc="/profile.svg" />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {}}>
        <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid
            xs={4}
            item
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Avatar style={{ width: '10vh', height: '10vh', padding: '2vh', backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText }}>
              {user?.firstName[0] || '' + user?.lastName[0] || ''}
            </Avatar>
          </Grid>
          <Grid xs={6} item>
            <Typography variant="h4">{`${user?.firstName || ''} ${
              user?.lastName || ''
            }`}</Typography>
            <Typography variant="body2">{user?.email}</Typography>
            <Typography variant="body2">{`Mon code ${user?.code}`}</Typography>
          </Grid>
        </Grid>
        {familyName && (
          <React.Fragment>
            <Divider style={{ marginTop: '2vh', marginBottom: '2vh' }} />
            <Typography variant="h5">Famille</Typography>
            <Typography>{`Nom ${familyName}`}</Typography>
            <Typography>{`${familyNbMembers} Membre${familyNbMembers > 1 ? 's' : ''}`}</Typography>
            <div
              style={{
                marginTop: '1vh',
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              {user && user.admin && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    dispatch(
                      openModal({
                        name: MODALS.EDIT_FAMILY,
                        params: {},
                      })
                    )
                  }
                >
                  Editer
                </Button>
              )}
              {showCode ? (
                <Typography style={{ marginLeft: '2vw' }}>
                  {familyCode?.toLocaleUpperCase()}
                </Typography>
              ) : (
                <Button onClick={handleShowCode}>Code Famille</Button>
              )}
            </div>
            <Divider style={{ marginTop: '2vh', marginBottom: '4vh' }} />
          </React.Fragment>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <Typography>Thème sombre</Typography>
          <Switch
            color="secondary"
            checked={dark}
            onChange={() => dispatch(toggleTheme())}
          />
        </div>
        <Divider style={{ marginTop: '2vh', marginBottom: '4vh' }} />
        {'Notification' in window &&
          <div style={{
            display: 'flex',
            borderColor: 'grey',
            borderWidth: active ? undefined : 2,
            borderStyle: active ? 'none' : 'dashed',
            borderRadius: 12,
            padding: '1vh 5vw',
            alignItems: 'center',
            backgroundColor: active ? dark ? '#2b2b2b' : 'white' : undefined,
            boxShadow: active ? '3px 3px 2px grey' : undefined
          }}>
            <Typography style={{ flexGrow: 1 }}>
              {getDeviceName()}
            </Typography>
            <Button onClick={handleRegister} variant="outlined">
              {active ? 'Désactiver' : 'Activer'}
            </Button>
          </div>
        }
        {isMobile && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: '10vh',
              right: 0,
              left: 0,
              paddingRight: '2vw',
            }}
          >
            <Button onClick={handleSignOut} variant="contained" color="primary">
              {loading ? 'Déconnexion' : 'Se Déconnecter'}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default Profile
