if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const warnEnvNotDefined = (envName: string, value: string): string => {
  console.warn(`${envName} not defined, defaulting to ${value}`)
  return value
}

export const port = process.env.PORT ?? warnEnvNotDefined("PORT", "3000")
export const dbUrl = process.env.DATABASE_URI ?? warnEnvNotDefined("DATABASE_URI", "postgres://postgres:postgres@db:5432/postgres")

export const login = 'http://opetushallinto.cs.helsinki.fi/login'

export const secret = process.env.SECRET ?? warnEnvNotDefined("SECRET", "supersecretthatyoushoulddefine")

const makeSubjectFin = (subject: string | number) => `[Ohjelmistotuotantoprojekti] ${subject}`
const makeSubjectEng = (subject: string | number) => `[Software engineering project] ${subject}`

const email = {
  isEnabled: process.env.EMAIL_ENABLED === 'true',
  general: {
    sender: 'Ohtuilmo Robot <noreply@helsinki.fi>',
    host: 'smtp.helsinki.fi',
    port: 587,
    secure: false,
    replyTo: 'matti.luukkainen@helsinki.fi',
    cc: 'matti.luukkainen@helsinki.fi'
  },
  subjects: {
    topicAccepted: {
      finnish: makeSubjectFin('Aihe-ehdotuksesi on hyväksytty'),
      english: makeSubjectEng('Your topic proposal has been accepted')
    },
    topicRejected: {
      finnish: makeSubjectFin('Aihe-ehdotustasi ei valittu'),
      english: makeSubjectEng('Your topic proposal was not selected')
    },
    customerReviewLink: {
      finnish: makeSubjectFin('Asiakkaan arvio on nyt auki'),
      english: makeSubjectEng('Customer review is now open')
    },
    secretLink: makeSubjectEng('Project proposal confirmation')
  }
}

const urls = {
  forSecretTopicLink: (secretId: string | number) =>
    `https://study.cs.helsinki.fi/projekti/topics/${secretId}`,
  forCustomerReviewLink: (secretId: string | number) =>
    `https://study.cs.helsinki.fi/projekti/customer-review/${secretId}`
}

export default {
  dbUrl,
  port,
  login,
  secret,
  email,
  urls
}
