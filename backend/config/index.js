if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.PORT
const dbUrl = process.env.DATABASE_URI

const login = 'http://opetushallinto.cs.helsinki.fi/login'

const secret = process.env.SECRET

const makeSubjectFin = (subject) => `[Ohjelmistotuotantoprojekti] ${subject}`
const makeSubjectEng = (subject) => `[Software engineering project] ${subject}`

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
  forSecretTopicLink: (secretId) =>
    `https://study.cs.helsinki.fi/projekti/topics/${secretId}`,
  forCustomerReviewLink: (secretId) =>
    `https://study.cs.helsinki.fi/projekti/customer-review/${secretId}`
}

module.exports = {
  dbUrl,
  port,
  login,
  secret,
  email,
  urls
}
