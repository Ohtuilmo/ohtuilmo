const tokenCheckRouter = require('express').Router()
const { checkLogin, checkInstructor, checkAdmin } = require('../middleware')

tokenCheckRouter.get('/login', checkLogin, (_req, res) => {
  res.status(200).json({ message: 'success' })
})

tokenCheckRouter.get('/admin', checkAdmin, (_req, res) => {
  res.status(200).json({ message: 'success' })
})

tokenCheckRouter.get('/instructor', checkInstructor, (_req, res) => {
  res.status(200).json({ message: 'success' })
})

module.exports = tokenCheckRouter
