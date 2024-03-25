const timeLogsRouter = require('express').Router()
const { checkLogin } = require('../middleware')
const group = require('../models/group')
//const db = require('../models/index')
//const { Sequelize } = require('sequelize')


const fakeData =
  [ {
    1: [
      { 'Joonatan Huang': 180 },
      { 'Mikko Ahro': 100 }]
  },
  {
    2: [
      { 'Joonatan Huang': 200 },
      { 'Mikko Ahro': 20 }]
  },
  {
    3: [
      { 'Joonatan Huang': 100 },
      { 'Mikko Ahro': 10 }]
  }
  ]

timeLogsRouter.get('/:id', checkLogin, async (req, res) => {
  const id = req.params.id
  console.log('groupSprintSummary id:', id)

  return res.status(200).json(fakeData)
})



module.exports = group
