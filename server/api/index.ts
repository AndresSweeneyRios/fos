import { Middleware } from 'koa'
import Router from 'koa-router'

import { Props } from '@interfaces'

import UserRouter from './user'

export default (props: Props): Middleware => {
  const router = new Router()

  router.use('/users', UserRouter(props))

  router.use('/test', ctx => ctx.body = { a: 'b' })

  return router.routes()
}
