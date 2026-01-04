import { Op } from 'sequelize'
import express, { Request, Response, NextFunction } from "express"
import db from '../models/index'
import { Topic } from '../models/topic'
import { Registration } from "../models/registration"
import { checkAdmin, checkLogin } from '../middleware'

const registrationsRouter = express.Router()

const handleDatabaseError = (res: Response, error: unknown) => {
  console.log(error)
  res.status(500).json({ error: 'Something is wrong... try reloading the page' })
}

const registrationCheck = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const latestConfig = await db.RegistrationManagement.findOne({
      order: [['createdAt', 'DESC']]
    })

    if (!latestConfig || !latestConfig.project_registration_open) {
      // registration config was not found or the registration was closed
      return res
        .status(400)
        .json({ error: 'project registration is not currently open' })
    }

    // pass request on to the next handler
    next()
  } catch (err) {
    console.error('Error in registrationCheck', err)
    return res.status(500).json({ error: 'Something is wrong... try reloading the page' })
  }
}

registrationsRouter.post(
  '/',
  checkLogin,
  registrationCheck,
  async (req: Request, res: Response) => {
    if (!req.body.questions)
      return res.status(400).json({ error: 'questions missing' })
    if (!req.body.preferred_topics)
      return res.status(400).json({ error: 'preferred_topics missing' })
    const loggedInUserStudentNumber = req.user.id

    try {
      const user = await db.User.findOne({
        where: { student_number: loggedInUserStudentNumber }
      })

      if (!user) {
        return res.status(400).json({ error: 'student not found' })
      }

      const registrationManagement = await db.RegistrationManagement.findOne({
        order: [['createdAt', 'DESC']]
      })

      if (!registrationManagement) {
        return res
          .status(400)
          .json({ error: 'registration management configuration not found' })
      }

      const configuration = await db.Configuration.findByPk(
        registrationManagement.project_registration_conf
      )

      if (!configuration) {
        return res.status(400).json({ error: 'configuration not found' })
      }

      const registration = await db.Registration.findOne({
        where: {
          configuration_id: configuration.id,
          studentStudentNumber: loggedInUserStudentNumber
        }
      })

      if (registration) {
        return res.status(400).json({ error: 'student already registered' })
      }

      const newRegistration = await db.Registration.create({
        preferred_topics: req.body.preferred_topics,
        questions: req.body.questions,
        configuration_id: configuration.id
      })
      await newRegistration.setStudent(loggedInUserStudentNumber)
      return res.status(201).json({ newRegistration })
    } catch (error) {
      handleDatabaseError(res, error)
    }
  }
)

registrationsRouter.get('/current', checkAdmin, async (req: Request, res: Response) => {
  const formatJson = (registration: Registration) => {
    const formattedTopics = registration.preferred_topics.map<Partial<Topic>>((topic) => {
      const { content, createdAt, updatedAt, ...rest } = topic
      return {
        ...rest,
        content: {
          email: content.email,
          title: content.title,
          customerName: content.customerName
        }
      }
    })

    return {
      student_number: registration.studentStudentNumber,
      last_name: registration.student!.last_name,
      first_names: registration.student!.first_names,
      email: registration.student!.email,
      preferred_topics: formattedTopics,
      questions: registration.questions
    }
  }

  try {
    const registrationManagement = await db.RegistrationManagement.findOne({
      order: [['createdAt', 'DESC']]
    })

    const registrations = await db.Registration.findAll({
      where: {
        configuration_id: registrationManagement.project_registration_conf
      },
      include: [
        {
          model: db.User,
          as: 'student'
        }
      ]
    })

    res.status(200).json({
      registrationCount: registrations.length,
      registrations: registrations.map(formatJson)
    })
  } catch (error) {
    handleDatabaseError(res, error)
  }
})

registrationsRouter.get('/', checkLogin, async (req: Request, res: Response) => {
  const loggedInUserStudentNumber = req.user.id

  try {
    const registrationManagement = await db.RegistrationManagement.findOne({
      order: [['createdAt', 'DESC']]
    })

    const peerReviewConf = registrationManagement.peer_review_conf
    const projectConf = registrationManagement.project_registration_conf

    const registrations = await db.Registration.findAll({
      where: {
        [Op.or]: [
          { configuration_id: peerReviewConf },
          { configuration_id: projectConf }
        ],
        studentStudentNumber: loggedInUserStudentNumber
      },
      include: ['student']
    })

    if (!registrations) {
      return res.status(204).send()
    }
    return res.status(200).json({ registrations })
  } catch (error) {
    handleDatabaseError(res, error)
  }
})

export default registrationsRouter
