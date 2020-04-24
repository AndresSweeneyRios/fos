import path from 'path'
import express from 'express'
import compression from 'compression'

import api from './api'

import Props from '@interfaces/Props'

export default async (props: Props): Promise<void> => {
  const {
    config, 
    success,
  } = props
  
  const app = express()

  app.use(compression())

  app.use(express.json())

  app.use(api(props))

  if (config.isDevelopment) {
    await app.listen(config.development.backendPort)
    success(`Running on port ${config.development.backendPort}.`)
  } else {
    app.use('/', express.static(path.resolve(__dirname, '..', 'dist', 'client')))
    
    app.use('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'dist', 'client'))
    })

    await app.listen(config.port)
    success(`Running on port ${config.port}.`)
  }
}
