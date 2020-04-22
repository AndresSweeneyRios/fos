const router = require('express').Router

module.exports = props => {
  const { db } = props

  const Users = db('users')

  Users.insert({ 'abc': 'def' })
  
  return router
}
