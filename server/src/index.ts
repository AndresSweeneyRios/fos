import chalk from 'chalk'
import path from 'path'
import Datastore from 'nedb-promises'

import config from '../../config'
import router from './router'

const success = (...args: Array<string>): void => {
  console.log(`${ chalk.bgGreen.black(' API ') }`, ...args, '\n')
}

const failure = (...args: Array<string>): void => {
  console.log(`${ chalk.bgRed.black(' API ') }`, ...args, '\n')
}

const init = async (): Promise<void> => {
  const db = (name: string): Datastore => new Datastore(
    path.join(config.dataPath, name),
  )

  const props = {
    config,
    success,
    failure,
    db,
  }

  await router(props)
}

init().catch(failure)
