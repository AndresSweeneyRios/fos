import Role from './Role'
import Message from './Message'

interface Config {
  development: {
    backendPort: number
    frontendPort: number
  }

  port: number

  dataPath: string

  isDevelopment: boolean

  textChannels: Array<{
    name: string
    id: string

    permissions: Array<{
      role: Role
      canWrite: boolean
      canRead: boolean
      canEmbed: boolean
      canAttach: boolean
      canPing: boolean
      canPingAll: boolean
      isMuted: boolean
    }>

    messages?: Array<Message>
  }>

  meta: {
    title: string
    description: string
    thumbnail: string
    themeColor: string
    url: string
  }
}

export default Config
