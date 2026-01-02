import util from 'util'
import express, { Request, Response, NextFunction } from "express"
import nodemailer from 'nodemailer'
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import db from '../models/index'
import { email as emailConfig, urls } from '../config/'
import { checkAdmin } from '../middleware'
import { TemplateName, emailTypeToTemplateName } from '../utils'

export const emailRouter = express.Router()

const sendSecretLink = (secretId: string, address: string) => {
  const url = urls.forSecretTopicLink(secretId)
  const html = `Thank you for the project proposal. You can use the below link to view or edit your proposal. <br /> <a href="${url}">Edit your submission</a>`
  send(address, emailConfig.subjects.secretLink, html)
}

const send = async (to: string, subject: string, html: string, text: string = "") => {
  const transporter = nodemailer.createTransport({
    host: emailConfig.general.host,
    port: emailConfig.general.port,
    secure: emailConfig.general.secure
  })

  const mailOptions = {
    from: emailConfig.general.sender,
    to: to,
    replyTo: emailConfig.general.replyTo,
    cc: emailConfig.general.cc,
    subject: subject,
    text: text,
    html: html
  }

  if (!emailConfig.isEnabled) {
    console.log('Email not enabled with EMAIL_ENABLED=true, skipping mail')
    return
  }

  const sendMailAsync = util.promisify<Mail.Options, SMTPTransport.SentMessageInfo>(transporter.sendMail.bind(transporter))

  try {
    const info = await sendMailAsync(mailOptions)

    if (info.rejected.length > 0) {
      const rejectedEmails = info.rejected.join(', ')
      const error = new Error(
        `SMTP server rejected the following recipients: ${rejectedEmails}`
      )
      console.error(info)
      throw error
    }

    console.log('email sent', info)
  } catch (error) {
    console.error('Mailing send failed')
    console.error(error)
    throw error
  }
}

const bodyValidator = (validator: (body: Record<string, any>, error: { message: string }) => boolean) => (req: Request, res: Response, next: NextFunction) => {
  // Passing error by reference, because type guards don't allow returning values
  // https://github.com/microsoft/TypeScript/issues/46650
  const error = { message: "" }
  validator(req.body, error)
  if (error) {
    return res.status(400).json({ error })
  }

  next()
}


interface SendBody {
  messageType: "topicAccepted" | "topicRejected" | "customerReviewLink"
  messageLanguage: "finnish" | "english"
  topicId: number
}

const validateSendBody = (body: Record<string, any>, err: { message: string }): body is SendBody => {
  if (!body) {
    err.message = 'All attributes must be defined'
    return false
  }

  if (
    body.messageType !== 'topicAccepted' &&
    body.messageType !== 'topicRejected' &&
    body.messageType !== 'customerReviewLink'
  ) {
    err.message = 'invalid messageType'
    return false
  }

  if (
    body.messageLanguage !== 'finnish' &&
    body.messageLanguage !== 'english'
  ) {
    err.message = 'invalid messageLanguage'
    return false
  }

  if (!body.topicId) {
    err.message = 'topicId required'
    return false
  }

  return true
}

const validatePreviewBody = validateSendBody

emailRouter.post(
  '/preview',
  checkAdmin,
  bodyValidator(validatePreviewBody),
  async (req, res) => {
    const { topicId, messageType, messageLanguage }: SendBody = req.body

    try {
      const topic = await db.Topic.findByPk(topicId)
      if (!topic) {
        return res.status(400).json({ error: `topic "${topicId}" not found` })
      }
      if (!topic.content || !topic.content.email) {
        return res.status(400).json({ error: 'topic has no content or email!' })
      }

      const templates = await db.EmailTemplate.findOne({
        order: [['created_at', 'DESC']]
      })

      if (!templates) {
        return res
          .status(400)
          .json({ error: 'email templates have not been configured' })
      }

      const dbTemplateName = emailTypeToTemplateName(
        messageType,
        messageLanguage
      )

      const renderedEmail = templates.render(dbTemplateName, { topic })
      const subject = emailConfig.subjects[messageType][messageLanguage]
      const to = topic.content && topic.content.email

      return res.status(200).json({ subject, to, email: renderedEmail })
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ error: e.message, details: e })
      return res.status(500).json({ error: e })
    }
  }
)

emailRouter.post(
  '/send',
  checkAdmin,
  bodyValidator(validateSendBody),
  async (req, res) => {
    const { topicId, messageType, messageLanguage }: SendBody = req.body

    try {
      const topic = await db.Topic.findByPk(topicId)
      if (!topic) {
        return res.status(400).json({ error: `topic "${topicId}" not found` })
      }
      if (!topic.content || !topic.content.email) {
        return res.status(400).json({ error: 'topic has no content or email!' })
      }

      const templates = await db.EmailTemplate.findOne({
        order: [['created_at', 'DESC']]
      })

      if (!templates) {
        return res
          .status(400)
          .json({ error: 'email templates have not been configured' })
      }

      const dbTemplateName = emailTypeToTemplateName(
        messageType,
        messageLanguage
      )

      const renderedEmail = templates.render(dbTemplateName, { topic })
      const subject = emailConfig.subjects[messageType][messageLanguage]

      await send(topic.content.email, subject, "", renderedEmail)
      const createdModel = await db.SentTopicEmail.create({
        topic_id: topic.id,
        email_template_name: dbTemplateName
      })
      res.status(200).json(db.SentTopicEmail.format(createdModel))
    } catch (e) {
      console.error('Mailing failed')
      console.error(e)
      if (e instanceof Error)
        return res.status(500).json({ error: e.message, details: e })
      return res.status(500).json({ error: e })
    }
  }
)

emailRouter.delete('/sent-emails', checkAdmin, async (_req, res) => {
  await db.SentTopicEmail.destroy({ where: {} })
  res.status(204).end()
})

const defaultEmailTemplates = {
  topic_accepted_fin: '',
  topic_rejected_fin: '',
  topic_accepted_eng: '',
  topic_rejected_eng: '',
  customer_review_link_fin: '',
  customer_review_link_eng: ''
}

interface EmailTemplate {
  topic_accepted_fin: string
  topic_rejected_fin: string
  topic_accepted_eng: string
  topic_rejected_eng: string
  customer_review_link_fin: string
  customer_review_link_eng: string
}

const serializeTemplatesByLanguage = ({
  topic_accepted_fin,
  topic_rejected_fin,
  topic_accepted_eng,
  topic_rejected_eng,
  customer_review_link_fin,
  customer_review_link_eng
}: EmailTemplate) => ({
  topicAccepted: {
    finnish: topic_accepted_fin,
    english: topic_accepted_eng
  },
  topicRejected: {
    finnish: topic_rejected_fin,
    english: topic_rejected_eng
  },
  customerReviewLink: {
    finnish: customer_review_link_fin,
    english: customer_review_link_eng
  }
})

const deserializeTemplatesByLanguage = ({
  topicAccepted,
  topicRejected,
  customerReviewLink
}: Record<string, Record<string, TemplateName>>) => ({
  topic_accepted_fin: topicAccepted.finnish,
  topic_rejected_fin: topicRejected.finnish,
  topic_accepted_eng: topicAccepted.english,
  topic_rejected_eng: topicRejected.english,
  customer_review_link_fin: customerReviewLink.finnish,
  customer_review_link_eng: customerReviewLink.english
})

emailRouter.get('/templates', checkAdmin, async (req, res) => {
  try {
    const templates = await db.EmailTemplate.findAll({
      limit: 1,
      order: [['created_at', 'DESC']]
    })

    const payload = templates.length > 0 ? templates[0] : defaultEmailTemplates
    return res.json(serializeTemplatesByLanguage(payload))
  } catch (err) {
    res.status(500).json({ error: 'Something is wrong... try reloading the page' })
  }
})

const isNil = (value: unknown) => value === undefined || value === null

const validateTemplates = (body: any, err: { message: string }): body is EmailTemplate => {
  if (!body) {
    err.message = 'All attributes must be defined'
    return false
  }

  const { topicAccepted, topicRejected, customerReviewLink } = body
  // allow empty strings!
  if (
    isNil(topicAccepted) ||
    isNil(topicRejected) ||
    isNil(customerReviewLink) ||
    isNil(topicAccepted.finnish) ||
    isNil(topicAccepted.english) ||
    isNil(topicRejected.finnish) ||
    isNil(topicRejected.english) ||
    isNil(customerReviewLink.finnish) ||
    isNil(customerReviewLink.english)
  ) {
    err.message = 'All attributes must be defined'
    return false
  }

  return true
}

const parseTemplates = (req: Request, res: Response, next: NextFunction) => {
  try {
    const deserialized = deserializeTemplatesByLanguage(req.body)
    req.locals = {
      ...req.locals,
      templates: deserialized
    }
    next()
  } catch (e) {
    res.status(500).json({ error: 'internal server error' })
  }
}

emailRouter.post(
  '/templates',
  checkAdmin,
  bodyValidator(validateTemplates),
  parseTemplates,
  async (req, res) => {
    const {
      topic_accepted_fin,
      topic_rejected_fin,
      customer_review_link_fin,
      topic_accepted_eng,
      topic_rejected_eng,
      customer_review_link_eng
    } = req.locals.templates

    try {
      const createdTemplates = await db.EmailTemplate.create({
        topic_accepted_fin,
        topic_rejected_fin,
        customer_review_link_fin,
        topic_accepted_eng,
        topic_rejected_eng,
        customer_review_link_eng
      })
      res.status(200).json(serializeTemplatesByLanguage(createdTemplates))
    } catch (e) {
      res.status(500).json({ error: 'Something is wrong... try reloading the page' })
    }
  }
)

emailRouter.delete('/templates', checkAdmin, async (req, res) => {
  await db.EmailTemplate.destroy({ where: {} })
  res.status(204).end()
})

export default {
  emailRouter,
  sendSecretLink
}
