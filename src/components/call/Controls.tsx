import { useState } from 'react'
import {
  IMicrophoneAudioTrack,
  ICameraVideoTrack
} from 'agora-rtc-react'
import {
  useClient
} from 'src/config/agora'
import { IconButton } from '@material-ui/core';
import { useNavigate } from 'react-router'
import { CallEnd, Mic, MicOff, Videocam, VideocamOff } from '@material-ui/icons';

interface IControlProps {
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  setStart: (v: boolean) => void
  setInCall: (v: boolean) => void
}

const Controls = ({ tracks, setStart, setInCall }: IControlProps) => {
  const client = useClient()
  const navigate = useNavigate()
  const [trackState, setTrackState] = useState({ video: true, audio: true })

  const mute = async (type: "audio" | "video") => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio)
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio }
      })
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video)
      setTrackState((ps) => {
        return { ...ps, video: !ps.video }
      })
    }
  };

  const leaveChannel = async () => {
    await client.leave()
    client.removeAllListeners()
    tracks[0].close()
    tracks[1].close()
    setStart(false)
    setInCall(false)
    navigate('/')
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: '10vh', right: 0, left: 0, width: '100%', justifyContent: 'center' }}>
      <IconButton className={trackState.audio ? "on" : ""} style={{ backgroundColor: 'lightgray' }}
        onClick={() => mute("audio")}>
        {trackState.audio ? <MicOff /> : <Mic />}
      </IconButton>
      <IconButton className={trackState.video ? "on" : ""} style={{ backgroundColor: 'lightgray', marginLeft: '2vh', marginRight: '2vh' }}
        onClick={() => mute("video")}>
        {trackState.video ? <VideocamOff /> : <Videocam />}
      </IconButton>
      {<IconButton onClick={() => leaveChannel()} style={{ backgroundColor: 'darkred', color: 'white' }}>
          <CallEnd />
      </IconButton>}
    </div>
  );
};

export default Controls