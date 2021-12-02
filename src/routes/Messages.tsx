import {
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import Header from 'src/components/structure/Header'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectAllConvs, selectUserId, selectUserLoggedIn } from 'src/redux/selectors'
import { loadConversation } from 'src/redux/slices/Conversations'

const Messages = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const loggedIn = useAppSelector(selectUserLoggedIn)
  const convs = useAppSelector(selectAllConvs)
  const userId = useAppSelector(selectUserId)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (!loggedIn) navigate('SignIn', { replace: true })
    if (convs.length <= 0 && userId) dispatch(loadConversation(userId))
  }, [loggedIn, dispatch, navigate, convs.length, userId])

  const handleConvSelect = (id: string) => {
    const url = `/Conversation/${id}`
    navigate(url)
  }

  return (
    <React.Fragment>
      <Header title="Conversations" imageSrc={'/convs.svg'} />
      <Divider />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {}}>
        <List>
          {convs.map((conv) => (
            <ListItem key={conv.id} button onClick={() => handleConvSelect(conv.id)}>
              <ListItemAvatar>
                <Avatar style={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText
                }}>{conv.name.slice(0, 2)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={conv.name} secondary={'Last Message'} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => console.log('HERE')}>
                  <MoreHoriz />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </React.Fragment>
  )
}

export default Messages
