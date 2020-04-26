import path from 'path'

import koa from 'koa'
import compression from 'koa-compress'
import json from 'koa-json'
import Router from 'koa-router'
import send from 'koa-send'

import fs from 'fs'

import api from './api'

import Props from '@interfaces/Props'

export default (props: Props): void => {
  const app = new koa()
  const router = new Router()

  const {
    config, 
    success,
  } = props

  app.use(compression())
  app.use(json())

  router.use('/api', api(props))

  app.use(router.routes())

  router.get('*', async ctx => {
    if (fs.existsSync(path.resolve('dist/client') + ctx.path)) {
      await send(ctx, 'dist/client' + ctx.path)
    } else {
      await send(ctx, 'dist/client/index.html')
    }
  })

  const port = config.isDevelopment ? config.development.backendPort : config.port

  app.listen(port)
  
  success(`Running on port ${port}.`)
}
