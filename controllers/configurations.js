const configurationsRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin, checkLogin } = require('../middleware')

// determines which associated models are returned with configuration
const includeArray = [
  'review_question_set_1',
  'review_question_set_2',
  'registration_question_set'
]

const handleDatabaseError = (res, error) => {
  console.log(error)
  res.status(500).json({ error: 'database error' })
}

const returnPopulatedConfiguration = (req, res, unPopulatedConfiguration) => {
  db.Configuration.findOne({
    where: { id: unPopulatedConfiguration.id },
    include: includeArray
  })
    .then((foundConfiguration) => {
      res.status(200).json({ configuration: foundConfiguration })
    })
    .catch((error) => handleDatabaseError(res, error))
}

const setForeignKeys = async (configuration, req, res) => {
  try {
    if (req.body.review_question_set_1_id) {
      const foundSet = await db.ReviewQuestionSet.findOne({
        where: { id: req.body.review_question_set_1_id }
      })
      if (!foundSet)
        return res
          .status(400)
          .json({ error: 'no peer review question set with that id' })
      await configuration.setReview_question_set_1(
        req.body.review_question_set_1_id
      )
    }
    if (req.body.review_question_set_2_id) {
      const foundSet = await db.ReviewQuestionSet.findOne({
        where: { id: req.body.review_question_set_2_id }
      })
      if (!foundSet)
        return res
          .status(400)
          .json({ error: 'no peer review question set with that id' })
      await configuration.setReview_question_set_2(
        req.body.review_question_set_2_id
      )
    }
    if (req.body.registration_question_set_id) {
      const foundSet = await db.RegistrationQuestionSet.findOne({
        where: { id: req.body.registration_question_set_id }
      })
      if (!foundSet)
        return res
          .status(400)
          .json({ error: 'no registration question set with that id' })
      await configuration.setRegistration_question_set(
        req.body.registration_question_set_id
      )
    }
    if (req.body.customer_review_question_set_id) {
      const foundSet = await db.CustomerReviewQuestionSet.findOne({
        where: { id: req.body.customer_review_question_set_id }
      })
      if (!foundSet)
        return res
          .status(400)
          .json({ error: 'no customer review question set with that id' })
      await configuration.setCustomer_review_question_set(
        req.body.customer_review_question_set_id
      )
    }
    returnPopulatedConfiguration(req, res, configuration)
  } catch (error) {
    handleDatabaseError(res, error)
  }
}

const createConfiguration = (req, res) => {
  db.Configuration.create({
    name: req.body.name,
    content: req.body.content
  })
    .then((created) => setForeignKeys(created, req, res))
    .catch((error) => handleDatabaseError(res, error))
}

const updateConfiguration = (configuration, req, res) => {
  configuration
    .update({
      name: req.body.name,
      content: req.body.content
    })
    .then((updated) => setForeignKeys(updated, req, res))
    .catch((error) => handleDatabaseError(res, error))
}

const createChecks = async (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'name undefined' })

  try {
    const configuration = await db.Configuration.findOne({
      where: { name: req.body.name }
    })
    if (configuration) {
      return res.status(400).json({ error: 'name already in use' })
    }
    createConfiguration(req, res)
  } catch (error) {
    handleDatabaseError(res, error)
  }
}

const updateChecks = async (req, res) => {
  if (isNaN(req.params.id)) return res.status(400).json({ error: 'invalid id' })
  if (!req.body.name) return res.status(400).json({ error: 'name undefined' })

  try {
    const duplicateName = await db.Configuration.findOne({
      where: { name: req.body.name }
    })

    if (duplicateName && duplicateName.id !== parseInt(req.params.id)) {
      return res.status(400).json({ error: 'name already in use' })
    }

    const configuration = await db.Configuration.findOne({
      where: { id: req.params.id }
    })

    if (!configuration) {
      return res
        .status(400)
        .json({ error: 'no configuration with provided id' })
    }

    updateConfiguration(configuration, req, res)
  } catch (error) {
    handleDatabaseError(res, error)
  }
}

configurationsRouter.post('/', checkAdmin, (req, res) => {
  createChecks(req, res)
})

configurationsRouter.put('/:id', checkAdmin, (req, res) => {
  updateChecks(req, res)
})

configurationsRouter.get('/', checkAdmin, (req, res) => {
  db.Configuration.findAll({
    include: includeArray
  })
    .then((configurations) => {
      res.status(200).json({ configurations })
    })
    .catch((error) => handleDatabaseError(res, error))
})

configurationsRouter.get('/:id', async (req, res) => {
  try {
    const response = await db.Configuration.findByPk(req.params.id, {
      include: includeArray
    })
    res.status(200).json(response)
  } catch (error) {
    handleDatabaseError(res, error)
  }
})

configurationsRouter.get(
  '/:id/reviewquestions/:reviewround',
  checkLogin,
  async (req, res) => {
    try {
      const response = await db.Configuration.findByPk(req.params.id, {
        include: [
          'review_question_set_1',
          'review_question_set_2',
          'registration_question_set'
        ]
      })
      if (req.params.reviewround === '1') {
        res.status(200).json(response.review_question_set_1)
      } else if (req.params.reviewround === '2') {
        res.status(200).json(response.review_question_set_2)
      } else {
        res.status(400).json({ error: 'bad review round' })
      }
    } catch (error) {
      handleDatabaseError(res, error)
    }
  }
)

configurationsRouter.get('/:id/customerreviewquestions',
  async (req, res) => {
    try {
      const response = await db.Configuration.findByPk(req.params.id, {
        include: 'customer_review_question_set'
      })
      res.status(200).json(response.customer_review_question_set)
    } catch (error) {
      handleDatabaseError(res, error)
    }
  }
)

module.exports = configurationsRouter
