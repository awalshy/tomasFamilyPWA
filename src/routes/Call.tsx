import { useState } from 'react'
import VideoCall from '../components/call/VideoCall'
import ChannelForm from '../components/call/ChannelForm'

const Call = () => {
  const [inCall, setInCall] = useState(false)
  const [channelName, setChannelName] = useState('')

  return (
    <div>
      {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
      )}
    </div>
  )
}

export default Call