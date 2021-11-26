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
  Button
} from '@material-ui/core'
import Header from '../components/structure/Header'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectAllMembers, selectUserFamilyId, selectUserId, selectUserLoggedIn } from '../redux/selectors'
import { PhoneEnabled } from '@material-ui/icons'
import { loadFamily } from '../redux/slices/Family'
import ListSkeleton from 'src/components/structure/ListSkeleton'

const Contact = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const loggedIn = useAppSelector(selectUserLoggedIn)
  const userId = useAppSelector(selectUserId)
  const userFamilyId = useAppSelector(selectUserFamilyId)
  const familyMembers = useAppSelector(selectAllMembers).filter(m => m.id !== userId)

  useEffect(() => {
    if (!loggedIn) navigate('/SignIn', { replace: true })
    if (familyMembers.length <= 0 && userFamilyId) {
      dispatch(loadFamily(userFamilyId))
      setTimeout(() => setLoading(false), 2000)
    } else setLoading(false)
  }, [loggedIn, dispatch, familyMembers.length, navigate, userFamilyId])

  return (
    <React.Fragment>
      <Header title="Contacts" imageSrc="/calls.svg" />
      <Divider />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {} }>
        <List>
          {familyMembers.map((member) => (
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
        {familyMembers.length === 0 && loading && ['0', '1', '2'].map(key => (
          <ListSkeleton key={key} />
        ))}
        {familyMembers.length === 0 && !loading && (
          <Card elevation={3} style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
            <Typography>Vous êtes seul dans votre famille...</Typography>
            <Button
              onClick={() => navigate('/Profile')}
            >
              Invitez Les !
            </Button>
          </Card>
        )}
      </div>
    </React.Fragment>
  )
}

export default Contact