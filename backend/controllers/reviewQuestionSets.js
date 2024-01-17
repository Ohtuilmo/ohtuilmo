const reviewQuestionSetsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin } = require('../middleware')

const handleDatabaseError = (res, error) => {
  console.log('--')
  console.log(error)
  console.log('--')
  res.status(500).json({ error: 'Something is wrong... try reloading the page ' })
}

const createReviewQuestionSet = (req, res) => {
  db.ReviewQuestionSet.create({
    name: req.body.name,
    questions: req.body.questions
  })
    .then((createdSet) => res.status(200).json({ questionSet: createdSet }))
    .catch((error) => handleDatabaseError(res, error))
}

const updateReviewQuestionSet = (req, res, questionSet) => {
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
  db.ReviewQuestionSet.findOne({ where: { name: req.body.name } })
    .then((foundSet) => {
      if (foundSet)
        return res.status(400).json({ error: 'name already in use' })
      createReviewQuestionSet(req, res)
    })
    .catch((error) => handleDatabaseError(res, error))
}

const updateChecks = (req, res) => {
  if (isNaN(req.params.id)) return res.status(400).json({ error: 'invalid id' })
  if (!req.body.name) return res.status(400).json({ error: 'name undefined' })
  db.ReviewQuestionSet.findOne({ where: { name: req.body.name } }).then(
    (duplicateNameSet) => {
      if (duplicateNameSet && duplicateNameSet.id !== parseInt(req.params.id))
        return res.status(400).json({ error: 'name already in use' })
      db.ReviewQuestionSet.findOne({ where: { id: req.params.id } }).then(
        (foundSet) => {
          if (!foundSet)
            return res
              .status(400)
              .json({ error: 'no review question set with that id' })
          updateReviewQuestionSet(req, res, foundSet)
        }
      )
    }
  )
}

reviewQuestionSetsRouter.post('/', checkAdmin, (req, res) => {
  createChecks(req, res)
})

reviewQuestionSetsRouter.put('/:id', checkAdmin, (req, res) => {
  updateChecks(req, res)
})

reviewQuestionSetsRouter.get('/', checkAdmin, (req, res) => {
  db.ReviewQuestionSet.findAll({})
    .then((foundSets) => {
      res.status(200).json({ questionSets: foundSets })
    })
    .catch((error) => handleDatabaseError(res, error))
})

reviewQuestionSetsRouter.get('/:id', async (req, res) => {
  try {
    const response = await db.ReviewQuestionSet.findByPk(req.params.id)
    res.status(200).json(response)
  } catch (error) {
    handleDatabaseError(res, error)
  }
})

reviewQuestionSetsRouter.delete('/:id', checkAdmin, async (req, res) => {
  const questionSetId = parseInt(req.params.id, 10)
  if (isNaN(questionSetId)) {
    return res.status(400).json({ error: 'invalid id' })
  }

  try {
    const targetSet = await db.ReviewQuestionSet.findByPk(questionSetId)
    if (!targetSet) {
      // already deleted, eh, just return ok
      return res.status(204).end()
    }

    await targetSet.destroy()
    return res.status(204).end()
  } catch (err) {
    console.error(
      'error while deleting question set with id',
      req.params.id,
      err
    )
    return res.status(500).json({ error: 'internal server error' })
  }
})

module.exports = reviewQuestionSetsRouter
