import path from 'path'

import Config from '@interfaces/Config'

import Role from '@interfaces/Role'

const defaultRole: Role = {
  id: 'default',
}

export default {
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

  dataPath: path.join(__dirname, '..', 'data'),

  port: 80,

  isDevelopment: process.env.NODE_ENV === 'development',
} as Config
