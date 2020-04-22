const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const Datastore = require('nedb-promises')

const configPath = path.join(__dirname, 'config.json')

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, '{\n}\n', 'utf8')
}

const userConfig = require('./config.json')

const config = {
  development: {
    backendPort: 8085,
    frontendPort: 8080,
  },

  data: path.join(__dirname, 'data'),

  port: 80,

  isDevelopment: process.env.NODE_ENV === 'development',

  ...userConfig,
}

const success = (...args) => {
  console.log(`${ chalk.bgGreen.black(' API ') }`, ...args, '\n')
}

const failure = (...args) => {
  console.log(`${ chalk.bgRed.black(' API ') }`, ...args, '\n')
}

const init = async () => {
  const db = name => new Datastore(path.join(config.data, name))

  const props = {
    config,
    success,
    failure,
    db,
  }

  require('./router')(props)
}

init().catch(failure)
