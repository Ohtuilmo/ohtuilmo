const timeLogsRouter = require('express').Router()
const { checkLogin } = require('../middleware')
const group = require('../models/group')
//const db = require('../models/index')
//const { Sequelize } = require('sequelize')


const fakeData =
  [
    {
      '1': [
        { 'Joonatan Huang': 120 },
        { 'Mikko Ahro': 150 },
        { 'Ella Virtanen': 130 },
        { 'Leo Niemi': 140 },
        { 'Noora Laine': 110 },
        { 'Sofia Heikkilä': 125 },
        { 'Antti Korhonen': 135 }
      ]
    },
    {
      '2': [
        { 'Joonatan Huang': 90 },
        { 'Mikko Ahro': 180 },
        { 'Ella Virtanen': 120 },
        { 'Leo Niemi': 160 },
        { 'Noora Laine': 105 },
        { 'Sofia Heikkilä': 135 },
        { 'Antti Korhonen': 140 }
      ]
    },
    {
      '3': [
        { 'Joonatan Huang': 200 },
        { 'Mikko Ahro': 160 },
        { 'Ella Virtanen': 150 },
        { 'Leo Niemi': 170 },
        { 'Noora Laine': 120 },
        { 'Sofia Heikkilä': 130 },
        { 'Antti Korhonen': 125 }
      ]
    }
  ]


timeLogsRouter.get('/:id', checkLogin, async (req, res) => {
  const id = req.params.id
  console.log('groupSprintSummary id:', id)

  return res.status(200).json(fakeData)
})



module.exports = group
