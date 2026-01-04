const registrationManagementRouter = require('express').Router()
const db = require('../models/index')
const { checkAdmin } = require('../middleware')

const handleDatabaseError = (res, error) => {
  console.log(error)
  res.status(500).json({ error: 'Something is wrong... try reloading the page' })
}

const create = async (req, res) => {
  const { registrationManagement } = req.body

  try {
    const createdConfig = await db.RegistrationManagement.create(
      registrationManagement
    )
    return res.status(201).json(createdConfig)
  } catch (err) {
    return handleDatabaseError(res, err)
  }
}

const isNil = (value) => value === undefined || value === null

const validateRegistrationManagement = async (registrationManagement) => {
  if (!registrationManagement) {
    return 'All attributes must be defined'
  }

  const {
    peer_review_conf,
    peer_review_open,
    peer_review_round,
    project_registration_conf,
    project_registration_open,
    project_registration_message,
    project_registration_info,
    topic_registration_conf,
    topic_registration_open,
    topic_registration_message
  } = registrationManagement

  if (
    isNil(peer_review_conf) ||
    isNil(peer_review_open) ||
    isNil(peer_review_round) ||
    isNil(project_registration_conf) ||
    isNil(project_registration_open) ||
    isNil(project_registration_message) ||
    isNil(project_registration_info) ||
    isNil(topic_registration_conf) ||
    isNil(topic_registration_open) ||
    isNil(topic_registration_message)
  ) {
    return 'All attributes must be defined'
  }

  if (!(peer_review_round === 1 || peer_review_round === 2)) {
    return 'Peer review round should be either 1 or 2'
  }

  if (!project_registration_open && project_registration_message.length === 0) {
    return 'Message must be provided when project registration is closed'
  }

  if (!topic_registration_open && topic_registration_message.length === 0) {
    return 'Message must be provided when topic registration is closed'
  }

  const allConfigurations = await db.Configuration.findAll({})

  const projectRegistrationConf = allConfigurations.find(
    (configuration) => configuration.id === project_registration_conf
  )

  if (!projectRegistrationConf) {
    return 'Provided configuration for project registration does not exist'
  }

  const peerReviewConf = allConfigurations.find(
    (configuration) => configuration.id === peer_review_conf
  )

  if (!peerReviewConf) {
    return 'Provided configuration for peer reviews does not exist'
  }

  const topicRegistrationConf = allConfigurations.find(
    (configuration) => configuration.id === topic_registration_conf
  )

  if (!topicRegistrationConf) {
    return 'Provided configuration for topic registration does not exist'
  }

  return null
}

registrationManagementRouter.post('/', checkAdmin, async (req, res) => {
  const { registrationManagement } = req.body

  const error = await validateRegistrationManagement(registrationManagement)
  if (error) {
    return res.status(400).json({ error })
  }

  create(req, res)
})

registrationManagementRouter.get('/', async (req, res) => {
  try {
    const entry = await db.RegistrationManagement.findOne({
      order: [['createdAt', 'DESC']]
    })

    if (!entry) {
      return res.status(400).json({
        error:
          'There are no saved registration management configurations in database.'
      })
    }

    return res.status(200).json({ registrationManagement: entry })
  } catch (err) {
    return handleDatabaseError(res, err)
  }
})

module.exports = registrationManagementRouter
