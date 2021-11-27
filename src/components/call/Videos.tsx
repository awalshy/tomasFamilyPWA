import { Card, ImageList, ImageListItem } from '@material-ui/core'
import {
  AgoraVideoPlayer,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ICameraVideoTrack
} from 'agora-rtc-react'

interface IVideosProps {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}
interface ITileProps {
  track: any
  audioPlaying: boolean
}

const Tile = ({ track, audioPlaying }: ITileProps) => {
  return (
    <Card elevation={3} style={Object.assign({ borderRadius: 12, width: '90%', height: '95%', backgroundColor: 'lightgray' }, audioPlaying ? { border: '2px solid darkred' } : {})}>
      <AgoraVideoPlayer className='vid' videoTrack={track} style={{ height: '100%', width: '100%' }} />
    </Card>
  )
}

const Videos = ({ users, tracks }: IVideosProps) => {
  if (users.length === 0) return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Tile track={tracks[1]} audioPlaying={false} />
    </div>
  )
  if (users.length === 1) return (
    <div>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Tile track={users[0].videoTrack} audioPlaying={users[0].audioTrack?.isPlaying || false} />
      </div>
      <div style={{ position: 'absolute', zIndex: 30, height: '25vh', width: '25vw', bottom: '5vh', right: '2vw' }}>
        <Tile track={tracks[1]} audioPlaying={false} />
      </div>
    </div>
  )
  if (users.length === 2) return (
    <div>
      <div style={{ width: '100vw', height: '50vh' }}>
        <Tile track={users[0].videoTrack} audioPlaying={users[0].audioTrack?.isPlaying || false} />
      </div>
      <div style={{ width: '100vw', height: '50vh' }}>
        <Tile track={users[1].videoTrack} audioPlaying={users[1].audioTrack?.isPlaying || false} />
      </div>
      <div style={{ position: 'absolute', zIndex: 30, height: '25vh', width: '25vw', bottom: '5vh', right: '2vw' }}>
        <Tile track={tracks[1]} audioPlaying={false} />
      </div>
    </div>
  )

  
  return (
    <div>
      <ImageList cols={2}>
        <ImageListItem>
          <Tile track={tracks[1]} audioPlaying={tracks[1].isPlaying} />
        </ImageListItem>
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <ImageListItem key={user.uid}>
                  <Tile track={user.videoTrack} audioPlaying={user.audioTrack?.isPlaying || true} />
                </ImageListItem>
              )
            } else return null;
          })}
      </ImageList>
    </div>
  )
}

export default Videos