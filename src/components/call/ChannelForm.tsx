import { AgoraConfig } from '../../config/agora'

const ChannelForm = ({ setInCall, setChannelName }: {
  setInCall: (v: boolean) => void
  setChannelName: (v: string) => void
}) => (
  <form className="join">
  {AgoraConfig.appId === '' && <p style={{color: 'red'}}>Please enter your Agora App ID in App.tsx and refresh the page</p>}
    <input type="text"
      placeholder="Enter Channel Name"
      onChange={(e) => setChannelName(e.target.value)}
    />
    <button onClick={(e) => {
      e.preventDefault()
      setInCall(true)
    }}>
      Join
    </button>
  </form>
)

export default ChannelForm