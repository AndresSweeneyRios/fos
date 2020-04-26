import { Middleware } from 'koa'
import Router from 'koa-router'

import Props from '@interfaces/Props'

import UserRouter from './user'

export default (props: Props): Middleware => {
  const router = new Router()

  router.use('/users', UserRouter(props))

  router.get('/', ctx => ctx.body = 'test')

  return router.routes()
}
