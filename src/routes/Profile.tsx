import { Avatar, Button, Divider, Grid, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from 'src/components/structure/Header'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectAppLoading, selectFamilyNbMembers, selectFamilyCode, selectFamilyName, selectUser, selectUserLoggedIn } from 'src/redux/selectors'
import { signOutUser } from 'src/redux/slices/App'
import { loadFamily } from 'src/redux/slices/Family'
import PageLayout from '../components/structure/PageLayout'

function Profile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const [showCode, setShowCode] = useState(false)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const familyCode = useAppSelector(selectFamilyCode)
  const familyName = useAppSelector(selectFamilyName)
  const familyNbMembers = useAppSelector(selectFamilyNbMembers)
  const user = useAppSelector(selectUser)
  const loggedIn = useAppSelector(selectUserLoggedIn)
  const loading = useAppSelector(selectAppLoading)

  useEffect(() => {
    if (!loggedIn || !user) navigate('/SignIn')
    if (!familyCode && user)
      dispatch(loadFamily(user.familyId))
  }, [loggedIn, navigate, user, dispatch, familyCode])

  const handleSignOut = () => {
    dispatch(signOutUser())
  }
  const handleShowCode = () => {
    setShowCode(true)
    setTimeout(() => setShowCode(false), 20000)
  }

  return (
    <PageLayout title="Profile">
      <Header
        title="Profile"
        imageSrc="/profile.svg"
      />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {  }}>
        <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid xs={4} item style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Avatar
              style={{ width: '10vh', height: '10vh', padding: '2vh' }}
            >
              {user?.firstName[0] || '' + user?.lastName[0] || ''}
            </Avatar>
          </Grid>
          <Grid xs={6} item>
            <Typography variant="h4">{`${user?.firstName || ''} ${user?.lastName || ''}`}</Typography>
            <Typography variant="body2">{user?.email}</Typography>
          </Grid>
        </Grid>
        {familyName && (
          <React.Fragment>
            <Divider style={{ marginTop: '2vh', marginBottom: '2vh' }} />
            <Typography variant="h5">Famille</Typography>
            <Typography>{`Nom ${familyName}`}</Typography>
            <Typography>{`${familyNbMembers} Membres`}</Typography>
            <div style={{ marginTop: '1vh', display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
              >
                Editer
              </Button>
              {showCode ? (
                <Typography style={{ marginLeft: '2vw' }}>{familyCode?.toLocaleUpperCase()}</Typography>
              ): (
              <Button
                onClick={handleShowCode}
              >
                Code Famille
              </Button>)}
            </div>
            <Divider style={{ marginTop: '2vh', marginBottom: '5vh' }} />
          </React.Fragment>
        )}
        {isMobile && <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', bottom: '10vh', right: 0, left: 0, paddingRight: '2vw' }}>
          <Button
            onClick={handleSignOut}
            variant="contained"
            color="primary"
          >
            {loading ? 'Déconnexion' : 'Se Déconnecter'}
          </Button>
        </div>}
      </div>
    </PageLayout>
  )
}

export default Profile