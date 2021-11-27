import { IconButton, TextField, Typography, useMediaQuery, useTheme, Divider } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import ChatBubble from 'src/components/ChatBubble'
import PageLayout from 'src/components/structure/PageLayout'
import API from 'src/firebase/api'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { selectConvById, selectMessagesOfConv, selectUserId } from 'src/redux/selectors'
import { loadConversation } from 'src/redux/slices/Conversations'
import { getMessagesInConv, sendMessage } from 'src/redux/slices/Messages'
import { RootState } from 'src/redux/store'

function Conversation() {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const navigate = useNavigate()
  const { id: convId } = useParams()
  const api = new API()

  const [message, setMessage] = useState('')

  const conversation = useAppSelector((state: RootState) => selectConvById(state, convId || ''))
  const messages = useAppSelector((state: RootState) => selectMessagesOfConv(state, convId || ''))
  const userId = useAppSelector(selectUserId)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (convId)
    api.messages.registerListenerToConv(convId, dispatch)

  useEffect(() => {
    if (!convId) {
      navigate(-1)
      return
    }
    if (messages.length <= 0 && conversation)
      dispatch(getMessagesInConv(convId))
    if (!conversation)
      dispatch(loadConversation(convId))
  }, [dispatch, messages, conversation, api.messages, convId, navigate])

  const handleSend = () => {
    if (!userId || !convId) return
    dispatch(sendMessage({
      id: '',
      senderId: userId,
      content: message,
      read: false,
      date: new Date(Date.now()).getTime(),
      conversationId: convId
    }))
    setMessage('')
  }

  return (
    <PageLayout title={conversation ? conversation.name : 'Conversation'}>
      <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          width: '100%',
          paddingLeft: isMobile ? undefined : '25vw',
          paddingRight: isMobile ? undefined : '25vw'
      }}>
        <div style={{ width: '100%', height: '8vh', display: 'flex', flexDirection: 'row', paddingLeft: '5vw', paddingRight: '5vw', alignItems: 'center' }}>
          <Typography variant="h5">
            {conversation?.name || 'Conversation'}
          </Typography>
        </div>
        <Divider />
        <div
          style={{
            width: '100%',
            height: '77vh',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflowY: 'scroll'
          }}
        >
          {messages.map(msg => (
            <ChatBubble key={msg.id} content={msg.content} me={msg.senderId === userId} />
          ))}
        </div>
        <div style={{
          width: '100%',
          display: 'flex', 
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TextField
            style={{ width: '80%' }}
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            onClick={handleSend}
          >
            <Send />
          </IconButton>
        </div>
      </div>
    </PageLayout>
  )
}

export default Conversation