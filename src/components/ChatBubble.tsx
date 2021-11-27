import { Typography } from '@material-ui/core'

interface IChatBubble {
  content: string,
  me?: boolean
}

function ChatBubble({ content, me }: IChatBubble) {
  return (
    <div style={{
      width: '100%',
      marginTop: '1vh',
      marginBottom: '1vh',
      paddingLeft: '2vw',
      paddingRight: '2vw',
      display: 'flex',
      flexDirection: me ? 'row-reverse' : 'row'
    }}>
      <div style={{
        width: '60%',
        borderRadius: 20,
        padding: 10,
        backgroundColor: me ? '#133c6d' : 'lightGrey',
        color: me ? 'white' : 'black'
      }}>
        <Typography variant="body2">
          {content}
        </Typography>        
      </div>
    </div>
  )
}

export default ChatBubble