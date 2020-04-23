import { Router } from 'express'

import Props from '@interfaces/Props'

export default (props: Props) => {
  const router = Router()

  const { db } = props

  const Users = db('users')

  Users.insert({ 'abc': 'def' })
  
  return router
}
