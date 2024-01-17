const topicDatesRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin } = require('../middleware')

topicDatesRouter.post('/', checkAdmin, (req, res) => {
  if (!req.body.dates) return res.status(400).json({ error: 'dates undefined' })
  db.TopicDate.create({
    dates: req.body.dates
  })
    .then(topicDate => {
      res.status(200).json({ topicDate })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Something is wrong... try reloading the page' })
    })
})

//fetches latest entry
topicDatesRouter.get('/', (req, res) => {
  db.TopicDate.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']]
  })
    .then(topicDate => {
      res.status(200).json({ topicDate })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Something is wrong... try reloading the page' })
    })
})

module.exports = topicDatesRouter