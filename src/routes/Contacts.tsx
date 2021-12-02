import {
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  useMediaQuery,
  ListItemSecondaryAction,
  Card,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core'
import { MoreHoriz, PhoneEnabled } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ListSkeleton from 'src/components/structure/ListSkeleton'

import { openModal, selectAppTheme } from 'src/redux/slices/App'

import { MODALS } from 'src/types/App'
import { TUser } from 'src/types/User'

import Header from '../components/structure/Header'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  selectAllMembers,
  selectUserFamilyId,
  selectUserId,
  selectUserLoggedIn,
} from '../redux/selectors'
import { loadFamily } from '../redux/slices/Family'

const Contact = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selected, setSelected] = useState<TUser | undefined>()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const loggedIn = useAppSelector(selectUserLoggedIn)
  const userId = useAppSelector(selectUserId)
  const userFamilyId = useAppSelector(selectUserFamilyId)
  const dark = useAppSelector(selectAppTheme)
  const familyMembers = useAppSelector(selectAllMembers).filter(
    (m) => m.id !== userId && m.firstName !== undefined && m.lastName !== undefined
  )

  useEffect(() => {
    if (!loggedIn) navigate('/SignIn', { replace: true })
    if (familyMembers.length <= 0 && userFamilyId) {
      dispatch(loadFamily(userFamilyId))
      setTimeout(() => setLoading(false), 2000)
    } else setLoading(false)
  }, [loggedIn, dispatch, familyMembers.length, navigate, userFamilyId])

  const handlePeak = () => {
    if (!selected) return
    dispatch(
      openModal({
        name: MODALS.PEAK_MEMBER,
        params: {
          id: selected.id,
        },
      })
    )
  }
  const handleMenu = (e: React.MouseEvent<HTMLElement>, member: TUser) => {
    setSelected(member)
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => {
    setSelected(undefined)
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Header title="Contacts" imageSrc="/calls.svg" />
      <Divider />
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handlePeak}>Details</MenuItem>
        <MenuItem disabled>Enoyer un message</MenuItem>
      </Menu>
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {}}>
        <List>
          {familyMembers.map((member) => (
            <ListItem key={member.id}>
              <ListItemAvatar>
                <Avatar
                  style={{
                    backgroundColor: theme.palette.secondary.dark,
                    color: theme.palette.secondary.contrastText,
                  }}
                >
                  {member.firstName[0] + member.lastName[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText>{member.firstName + ' ' + member.lastName}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton onClick={() => navigate('/Call')}>
                  <PhoneEnabled style={dark ? { color: theme.palette.text.primary } : undefined} />
                </IconButton>
                <IconButton onClick={(e) => handleMenu(e, member)}>
                  <MoreHoriz style={dark ? { color: theme.palette.text.primary } : undefined} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {familyMembers.length === 0 &&
          loading &&
          ['0', '1', '2'].map((key) => <ListSkeleton key={key} />)}
        {familyMembers.length === 0 && !loading && (
          <Card
            elevation={3}
            style={{
              padding: 20,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
            }}
          >
            <Typography>Vous êtes seul dans votre famille...</Typography>
            <Button onClick={() => navigate('/Profile')}>Invitez Les !</Button>
          </Card>
        )}
      </div>
    </React.Fragment>
  )
}

export default Contact
