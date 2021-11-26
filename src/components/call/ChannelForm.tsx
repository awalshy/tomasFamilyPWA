import { Typography } from "@material-ui/core"

const ChannelForm = ({ setInCall, setChannelName }: {
  setInCall: (v: boolean) => void
  setChannelName: (v: string) => void
}) => {
  setTimeout(() => {
    setChannelName('test')
    setInCall(true)
  }, 5000)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h3">
        Connection à l'appel...
      </Typography>
    </div>
  )
}

export default ChannelForm