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
  Fab,
} from '@material-ui/core'
import { Add, MoreHoriz } from '@material-ui/icons'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import Header from 'src/components/structure/Header'

import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectAllConvs, selectUserId, selectUserLoggedIn } from 'src/redux/selectors'
import { openModal } from 'src/redux/slices/App'
import { loadConversation } from 'src/redux/slices/Conversations'
import { MODALS } from 'src/types/App'

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
      <Fab
          color="secondary"
          variant={isMobile ? 'circular' : 'extended'}
          style={{ position: 'absolute', bottom: '10vh', right: '5vw' }}
          onClick={() =>
            dispatch(
              openModal({
                name: MODALS.CREATE_CONVERSATION,
                params: {},
              })
            )
          }
        >
          <Add />
          {!isMobile && 'New Conv'}
        </Fab>
    </React.Fragment>
  )
}

export default Messages
