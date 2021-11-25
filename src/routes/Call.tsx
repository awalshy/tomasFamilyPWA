import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const VideoCall = dynamic(() => import('components/call/VideoCall'))
const ChannelForm = dynamic(() => import('components/call/ChannelForm'))

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