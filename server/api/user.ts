import { Middleware } from 'koa'
import Router from 'koa-router'

import Props from '@interfaces/Props'
import User from '@interfaces/User'

export default (props: Props): Middleware => {
  const router = new Router()

  const { 
    db, 
  } = props

  const Users = db('users')

  router.post('/new', async ctx => {
    const {
      publicKey, 
      name,
    }: User = ctx.body

    if (!publicKey) return ctx.throw(400, 'No public key provided.')
    if (!name) return ctx.throw(400, 'No name provided.')

    const user: User = {
      publicKey,
      name,
      createdAt: Date.now(),
      roles: [],
      id: 12345678,
      avatar: null,
      externalAccounts: {},
    }

    await Users.insert(user)

    ctx.body = user
  })

  return router.routes()
}
