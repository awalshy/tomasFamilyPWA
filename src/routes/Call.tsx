import { useState } from 'react'

import ChannelForm from 'src/components/call/ChannelForm'
import VideoCall from 'src/components/call/VideoCall'

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
