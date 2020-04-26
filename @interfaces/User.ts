import Role from './Role'

interface User {
  publicKey: string
  id: number
  name: string
  roles: Array<Role>
  createdAt: number
  avatar: null | string

  externalAccounts: {
    discord?: string
    github?: string
    google?: string
    twitch?: string
    twitter?: string
  }
}

export default User
