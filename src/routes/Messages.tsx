import {
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core'
import Header from 'components/structure/Header'
import PageLayout from 'components/structure/PageLayout'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { selectAllConvs, selectUserId, selectUserLoggedIn } from 'redux/selectors'
import { loadConversation } from 'redux/slices/Conversations'

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
    if (convs.length <= 0 && userId)
      dispatch(loadConversation(userId))
  }, [loggedIn, dispatch, navigate, convs.length, userId])

  return (
    <PageLayout title="Conversations">
      <Header title="Conversations" imageSrc={'/convs.svg'} />
      <Divider />
      <div style={!isMobile ? { paddingLeft: '25vw', paddingRight: '25vw' } : {} }>
        <List>
          {convs.map(conv => (
            <ListItem
              key={conv.id}
            >
              <ListItemAvatar>
                <Avatar>{conv.name.slice(0, 2)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={conv.name} secondary={'Last Message'} />
            </ListItem>
          ))}
        </List>
      </div>
    </PageLayout>
  )
}

export default Messages