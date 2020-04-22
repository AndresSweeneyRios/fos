const path = require('path')
const express = require('express')
const api = require('./api')

module.exports = async props => {
  const {
    config, 
    success,
  } = props
  
  const app = express()

  app.use(express.json())

  app.use(api(props))

  if (config.isDevelopment) {
    await app.listen(config.development.backendPort)

    success(`Running on port ${config.development.backendPort}.`)
  } else {
    app.use('/', express.static(path.resolve('dist')))
    
    app.use('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'))
    })
  
    await app.listen(config.port)

    success(`Running on port ${config.port}.`)
  }
}
