import { Middleware } from 'koa'
import Router from 'koa-router'

import { Props } from '@interfaces'

import NewUser from './new'
import Login from './login'

export default (props: Props): Middleware => {
  const router = new Router()

  router.use('/new', NewUser(props))
  router.use('/login', Login(props))

  return router.routes()
}
