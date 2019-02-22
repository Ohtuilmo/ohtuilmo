const registrationQuestionSetsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin } = require('../middleware')

const handleDatabaseError = (res, error) => {
  console.log(error)
  res.status(500).json({ error: 'database error' })
}

const createRegistrationQuestionSet = (req, res) => {
  db.RegistrationQuestionSet.create({
    name: req.body.name,
    questions: req.body.questions
  })
    .then((createdSet) => res.status(200).json({ questionSet: createdSet }))
    .catch((error) => handleDatabaseError(res, error))
}

const updateRegistrationQuestionSet = (req, res, questionSet) => {
  questionSet
    .update({
      name: req.body.name,
      questions: req.body.questions
    })
    .then((questionSet) => {
      questionSet
        .reload()
        .then((updatedSet) => {
          res.status(200).json({ questionSet: updatedSet })
        })
        .catch((error) => handleDatabaseError(res, error))
    })
    .catch((error) => handleDatabaseError(res, error))
}

const createChecks = (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'name undefined' })
  db.RegistrationQuestionSet.findOne({ where: { name: req.body.name } })
    .then((foundSet) => {
      if (foundSet)
        return res.status(400).json({ error: 'name already in use' })
      createRegistrationQuestionSet(req, res)
    })
    .catch((error) => handleDatabaseError(res, error))
}

const updateChecks = (req, res) => {
  if (isNaN(req.params.id)) return res.status(400).json({ error: 'invalid id' })
  if (!req.body.name) return res.status(400).json({ error: 'name undefined' })
  db.RegistrationQuestionSet.findOne({ where: { name: req.body.name } }).then(
    (duplicateNameSet) => {
      if (duplicateNameSet && duplicateNameSet.id !== parseInt(req.params.id))
        return res.status(400).json({ error: 'name already in use' })
      db.RegistrationQuestionSet.findOne({ where: { id: req.params.id } }).then(
        (foundSet) => {
          if (!foundSet)
            return res
              .status(400)
              .json({ error: 'no registration question set with that id' })
          updateRegistrationQuestionSet(req, res, foundSet)
        }
      )
    }
  )
}

registrationQuestionSetsRouter.post('/', checkAdmin, (req, res) => {
  createChecks(req, res)
})

registrationQuestionSetsRouter.put('/:id', checkAdmin, (req, res) => {
  updateChecks(req, res)
})

registrationQuestionSetsRouter.get('/', checkAdmin, (req, res) => {
  db.RegistrationQuestionSet.findAll({})
    .then((foundSets) => {
      res.status(200).json({ questionSets: foundSets })
    })
    .catch((error) => handleDatabaseError(res, error))
})

module.exports = registrationQuestionSetsRouter
