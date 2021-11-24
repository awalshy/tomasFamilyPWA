import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  Theme,
  makeStyles,
  createStyles
} from '@material-ui/core'

import PageLayout from 'components/structure/PageLayout'
import { selectAppLoading, selectUserLoggedIn, signInUser,  } from 'redux/slices/App'
import { useAppSelector, useAppDispatch } from 'redux/hooks'

const SignIn = (): JSX.Element => {
  const styles: any = useStyles()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const appLoading = useAppSelector(selectAppLoading)
  const loggedIn = useAppSelector(selectUserLoggedIn)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (loggedIn) router.push('/')
  }, [loggedIn, dispatch, router])

  const signin = () => {
    dispatch(signInUser({
      email, password
    }))
  }

  return (
    <PageLayout title="Sign In">
      <div className={styles.center}>
          <Card className={styles.card} raised>
            <div className={styles.image}>
              <Image
                src="/logo_head.svg"
                alt="TOMAS Logo"
                width="150vh"
                height="150vh"
              />
            </div>
              <CardContent>
                <Typography className={styles.title}>Sign In</Typography>
                <div className={styles.input}>
                  <TextField
                    className={styles.input}
                    id="email"
                    label="Email"
                    value={email}
                    variant="standard"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    className={styles.input}
                    id="password"
                    type="password"
                    label="Password"
                    value={password}
                    variant="standard"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardActions className={styles.actions}>
                <Button onClick={signin}>{appLoading ? 'Connexion...' : 'Se connecter'}</Button>
              </CardActions>
          </Card>
      </div>
    </PageLayout>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      height: '30vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    background: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 20,
      backgroundColor: theme.palette.primary.main,
    },
    center: {
      height: '95vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 40,
    },
    inputs: {
      display: 'flex',
      flexDirection: 'column',
      justifyItems: 'center',
      alignItems: 'center',
      width: '80%',
      marginTop: '5%',
      marginBottom: '2%',
    },
    input: {
      width: '100%',
    },
    root: {
      [theme.breakpoints.down('md')]: {
        width: '85%',
      },
      [theme.breakpoints.up('md')]: {
        width: '35%',
      },
    },
    card: {
      borderRadius: 12,
      padding: '5%',
      backgroundColor: '#e6e6e6a4',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    actions: {
      display: 'flex',
      flexDirection: 'row-reverse',
      padding: '4px 12px',
    },
  })
)

export default SignIn