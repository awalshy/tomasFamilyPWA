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
  ListItemSecondaryAction
} from '@material-ui/core'
import Header from '../components/structure/Header'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectAllMembers, selectUserFamilyId, selectUserLoggedIn } from '../redux/selectors'
import { PhoneEnabled } from '@material-ui/icons'
import { loadFamily } from '../redux/slices/Family'

const Contact = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const loggedIn = useAppSelector(selectUserLoggedIn)
  const userFamilyId = useAppSelector(selectUserFamilyId)
  const familyMembers = useAppSelector(selectAllMembers)

  useEffect(() => {
    if (!loggedIn) navigate('/SignIn', { replace: true })
    if (familyMembers.length <= 0 && userFamilyId)
      dispatch(loadFamily(userFamilyId))
  }, [loggedIn, dispatch, familyMembers.length, navigate, userFamilyId])

  return (
    <React.Fragment>
      <Header title="Contacts" imageSrc="/calls.svg" />
      <Divider />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {} }>
        <List>
          {familyMembers.map(member => (
            <ListItem key={member.id} >
              <ListItemAvatar>
                <Avatar>{member.firstName[0] + member.lastName[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText>
                {member.firstName + ' ' + member.lastName}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => navigate('/Call')}
                >
                  <PhoneEnabled />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </React.Fragment>
  )
}

export default Contact