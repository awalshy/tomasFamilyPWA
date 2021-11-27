import { CircularProgress, Typography } from "@material-ui/core"

const ChannelForm = ({ setInCall, setChannelName }: {
  setInCall: (v: boolean) => void
  setChannelName: (v: string) => void
}) => {
  setTimeout(() => {
    setChannelName('test')
    setInCall(true)
  }, 4000)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
        <Typography variant="h3">
          Connection...
        </Typography>
        <CircularProgress variant="indeterminate" color="primary" />
    </div>
  )
}

export default ChannelForm