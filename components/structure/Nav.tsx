import React, { useState } from 'react'
import clsx from 'clsx'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Drawer,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  CssBaseline,
} from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  Menu as MenuIcon,
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  Dashboard,
} from '@mui/icons-material'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import firebase from 'firebase'
import Link from 'next/link'

import { TUser } from 'types/User'
import { RootState } from 'redux/store'
import { useAppDispatch } from 'redux/hooks'
import { signOutUser } from 'redux/slices/App'

const drawerWidth = 240

const Nav = ({
  user,
  children,
  subtitle,
}: {
  user: TUser | undefined
  children: JSX.Element | JSX.Element[]
  subtitle?: string
}) => {
  const router = useRouter()
  const classes: any = useStyle()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [drawerOpen, displayDrawer] = useState(false)
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
    router.push('/SignIn')
  }
  const handleDrawerOpen = () => displayDrawer(true)
  const handleDrawerClose = () => displayDrawer(false)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            <Link href="/">
              <Typography variant="h5" noWrap>
                TOMAS Family App
              </Typography>
            </Link>
            {subtitle && <Typography variant="h6" className={classes.subtitle}>
              {subtitle}
            </Typography>}
          </div>
          {firebase.auth().currentUser && (
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
          {!firebase.auth().currentUser && (
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
      <Drawer
        variant="persistent"
        className={classes.drawer}
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => router.push('/')}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        <div className={classes.rootChildren}>
          {children}
        </div>
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
      height: '86vh',
      paddingTop: '3vh',
      paddingLeft: '2vw',
      paddingRight: '2vw',
      width: '90vw'
    },
    appBar: {
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
      backgroundColor: '#e6e6e6',
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
      flexGrow: 1,
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

const mapStateToProps = (state: RootState) => ({
  user: state.app.user,
  loggedIn: state.app.loggedIn,
})

export default connect(mapStateToProps)(Nav)