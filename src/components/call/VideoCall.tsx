import { IAgoraRTCRemoteUser } from 'agora-rtc-react'
import { useEffect, useState } from 'react'

import { useMicrophoneAndCameraTracks, useClient, AgoraConfig } from 'src/config/agora'

import Controls from './Controls'
import Videos from './Videos'

type IVideoCall = {
  setInCall: (v: boolean) => void
  channelName: string
}

function VideoCall({ setInCall, channelName }: IVideoCall) {
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [, setStart] = useState(false)
  const client = useClient()
  const { ready, tracks } = useMicrophoneAndCameraTracks()

  useEffect(() => {
    let init = async (name: string) => {
      console.log('Init', name)
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        console.log('subscribe success')
        if (mediaType === 'video') setUsers((prevUsers) => [...prevUsers, user])
        if (mediaType === 'audio') user.audioTrack?.play()
      })
      client.on('user-unpublished', (user, type) => {
        console.log('unpublished', user, type)
        if (type === 'audio') user.audioTrack?.stop()
        if (type === 'video')
          setUsers((prevUsers) => {
            return prevUsers.filter((u) => u.uid !== user.uid)
          })
      })
      client.on('user-left', (user) => {
        console.log('user left', user)
        setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid))
      })
      await client.join(AgoraConfig.appId, name, AgoraConfig.token, null)
      if (tracks) await client.publish([tracks[0], tracks[1]])
      setStart(true)
    }

    if (ready && tracks) {
      console.log('ready')
      init(channelName)
    }
  }, [channelName, client, ready, tracks])

  return (
    <div style={{ padding: 20 }}>
      {ready && tracks && <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />}
      {tracks && <Videos users={users} tracks={tracks} />}
    </div>
  )
}

export default VideoCall
