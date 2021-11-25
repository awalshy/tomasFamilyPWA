import React, { useState } from 'react'
import Image from 'next/image'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Theme,
  CssBaseline,
  useTheme,
  useMediaQuery,
  makeStyles,
  createStyles
} from '@material-ui/core'
import {
  AccountCircle,
} from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'
import firebase from 'firebase'
import Link from 'react-router-dom'

import { selectUser, selectUserLoggedIn } from 'redux/selectors'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { signOutUser } from 'redux/slices/App'

const Nav = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const classes: any = useStyle()
  const dispatch = useAppDispatch()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const user = useAppSelector(selectUser)
  const loggedIn = useAppSelector(selectUserLoggedIn)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const logout = async () => {
    await firebase.auth().signOut()
    dispatch(signOutUser())
    // dispatch(
    //   enqueueSnack('You have been logged out', {
    //       variant: 'success',
    //     })
    // )
    navigate('/SignIn')
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        className={classes.appBar}
      >
        <Toolbar>
          <div style={isMobile ? { flexGrow: 1 } : {}} className={classes.title}>
            <Link href="/" passHref>
              <Image
                height="40"
                width="200"
                alt="TOMAS Logo"
                src="/LogoColorLight.svg"
              />
            </Link>
          </div>
          {!isMobile && loggedIn && <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Link href="/Messages" passHref>
                <Typography variant="h6">Messages</Typography>
              </Link>
              <Link href="/Contacts" passHref>
                <Typography variant="h6">Contacts</Typography>
              </Link>
              <Link href="/Gallery" passHref>
                <Typography variant="h6">Gallerie</Typography>
              </Link>
          </div>}
          {loggedIn && (
            <div>
              <div className={classes.container}>
                <Typography className={classes.user}>
                  Hi {user?.firstName} !
                </Typography>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => router.push('/Profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
          {!loggedIn && (
            <div>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.replace('/SignIn')}
              >
                Sign In
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.rootChildren}>
        {children}
      </div>
    </div>
  )
}

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    rootChildren: {
      height: '96vh',
      marginTop: '4vh',
      paddingTop: '6vh',
      paddingLeft: '2vw',
      paddingRight: '2vw',
      width: '100vw',
      backgroundColor: '#e6e6e6'
    },
    appBar: {
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    subtitle: {
      marginLeft: 15
    },
    title: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-arround',
      cursor: 'pointer'
    },
    user: {
      marginRight: '1vw',
      color: 'white',
      [theme.breakpoints.down('md')]: {
        display: 'none'
      }
    },
    container: {
      display: 'flex',
      alignItems: 'center',
    },
  })
)

export default Nav