import { createClient, createMicrophoneAndCameraTracks, ClientConfig } from 'agora-rtc-react'

const clientConfig: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
}
const appId: string = 'c628d1c7315b4593abda3fea1790d55a'
const token: string | null = null

export const useClient = createClient(clientConfig)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
export const AgoraConfig = {
  appId,
  token,
}
