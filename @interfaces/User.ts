import { Role } from './Role'

export interface User {
  publicKey: string
  id: number
  roles: Array<Role>
  createdAt: number
  username: string
  hash: string
  nickname?: string
  avatar?: string

  externalAccounts: {
    discord?: string
    github?: string
    google?: string
    twitch?: string
    twitter?: string
  }
}
