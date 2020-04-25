import path from 'path'

import Config from '../@interfaces/Config'
import Role from '../@interfaces/Role'

const defaultRole: Role = {
  id: 'default',
}

const config: Config = {
  development: {
    backendPort: 8085,
    frontendPort: 8080,
  },

  textChannels: [
    {
      name: 'general',
      id: 'general',
      permissions: [
        {
          role: defaultRole,
          canWrite: true,
          canRead: true,
          canEmbed: true,
          canAttach: true,
          canPing: true,
          canPingAll: false,
          isMuted: false,
        },
      ],
    },
  ],

  meta: {
    title: 'FOS',
    description: 'An encrypted, self-hosted chatroom.',
    thumbnail: 'https://example.com/thumb.png',
    themeColor: '#EB7A96',
    url: 'https://example.com',
  },

  dataPath: path.join(__dirname, '..', 'data'),

  port: Number(process.env.PORT) || 44444,

  isDevelopment: process.env.NODE_ENV === 'development',
}

export default config
