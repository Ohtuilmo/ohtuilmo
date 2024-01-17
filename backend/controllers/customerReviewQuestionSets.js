const customerReviewQuestionSetsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin } = require('../middleware')

const handleDatabaseError = (res, error) => {
  console.log(error)
  res.status(500).json({ error: 'Something is wrong... try reloading the page ' })
}

const createCustomerReviewQuestionSet = async (req, res) => {
  try {
    const createdSet = await db.CustomerReviewQuestionSet.create({
      name: req.body.name,
      questions: req.body.questions
    })
    res.status(200).json({ questionSet: createdSet })
  } catch (e) {
    handleDatabaseError(res, e)
  }
}

const updateCustomerReviewQuestionSet = async (req, res, questionSet) => {
  try {
    const updatedSet = await questionSet.update({
      name: req.body.name,
      questions: req.body.questions
    })

    const reloadedSet = await updatedSet.reload()
    res.status(200).json({ questionSet: reloadedSet })
  } catch (e) {
    handleDatabaseError(res, e)
  }
}

customerReviewQuestionSetsRouter.post('/', checkAdmin, async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'name undefined' })
  }

  try {
    const foundSet = await db.CustomerReviewQuestionSet.findOne({
      where: { name: req.body.name }
    })
    if (foundSet) {
      return res.status(400).json({ error: 'name already in use' })
    }
    await createCustomerReviewQuestionSet(req, res)
  } catch (e) {
    handleDatabaseError(res, e)
  }
})

customerReviewQuestionSetsRouter.put('/:id', checkAdmin, async (req, res) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: 'invalid id' })
  }
  if (!req.body.name) {
    return res.status(400).json({ error: 'name undefined' })
  }

  try {
    const duplicateNameSet = await db.CustomerReviewQuestionSet.findOne({
      where: { name: req.body.name }
    })

    if (duplicateNameSet && duplicateNameSet.id !== parseInt(req.params.id)) {
      return res.status(400).json({ error: 'name already in use' })
    }

    const foundSet = await db.CustomerReviewQuestionSet.findOne({
      where: { id: req.params.id }
    })

    if (!foundSet) {
      return res
        .status(400)
        .json({ error: 'no customer review question set with that id' })
    }

    await updateCustomerReviewQuestionSet(req, res, foundSet)
  } catch (e) {
    handleDatabaseError(res, e)
  }
})

customerReviewQuestionSetsRouter.get('/', checkAdmin, async (req, res) => {
  try {
    const foundSets = await db.CustomerReviewQuestionSet.findAll({})
    res.status(200).json({ questionSets: foundSets })
  } catch (e) {
    handleDatabaseError(res, e)
  }
})

customerReviewQuestionSetsRouter.get('/:id', checkLogin, async (req, res) => {
  try {
    const response = await db.CustomerReviewQuestionSet.findByPk(req.params.id)
    res.status(200).json(response)
  } catch (error) {
    handleDatabaseError(res, error)
  }
})

customerReviewQuestionSetsRouter.delete(
  '/:id',
  checkAdmin,
  async (req, res) => {
    const questionSetId = parseInt(req.params.id, 10)
    if (isNaN(questionSetId)) {
      return res.status(400).json({ error: 'invalid id' })
    }

    try {
      const targetSet = await db.CustomerReviewQuestionSet.findByPk(
        questionSetId
      )
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
  }
)

module.exports = customerReviewQuestionSetsRouter
