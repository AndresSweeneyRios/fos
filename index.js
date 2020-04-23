const options = require('./tsconfig.json')

require('ts-node').register(options)

module.exports = require('./server/index.ts')
