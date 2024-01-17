const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { logger } = require('./middleware')
const headersMiddleware = require('unfuck-utf8-headers-middleware')
const config = require('./config/')
const app = express()

var unless = (path, middleware) => {
  return (req, res, next) => {
    if (path === req.path) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}

/**
 * Fix charset for shibboleth headers
 */
const shibbolethHeaders = [
  'uid',
  'givenname', // First name
  'mail', // Email
  'hypersonstudentid', // Contains student number
  'sn' // Last name
]

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(headersMiddleware(shibbolethHeaders))
app.use(unless('/api/login', logger))

// Routers
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const topicsRouter = require('./controllers/topics')
const topicDatesrouter = require('./controllers/topicDates')
const tokenCheckRouter = require('./controllers/tokenCheck')
const registrationRouter = require('./controllers/registrations')
const usersRouter = require('./controllers/users')
const configurationsRouter = require('./controllers/configurations')
const registrationQuestionSetsRouter = require('./controllers/registrationQuestionSets')
const reviewQuestionSetsRouter = require('./controllers/reviewQuestionSets')
const customerReviewQuestionSetsRouter = require('./controllers/customerReviewQuestionSets')
const emailRouter = require('./controllers/email').emailRouter
const registrationManagementRouter = require('./controllers/registrationManagement')
const groupRouter = require('./controllers/groups')
const peerReview = require('./controllers/peerReview')
const customerReview = require('./controllers/customerReview')
const autoCompleteRouter = require('./controllers/autocomplete')
const instructorReviewRouter = require('./controllers/instructorReview')
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/topicDates', topicDatesrouter)
app.use('/api/tokenCheck', tokenCheckRouter)
app.use('/api/registrations', registrationRouter)
app.use('/api/users', usersRouter)
app.use('/api/configurations', configurationsRouter)
app.use('/api/registrationQuestions', registrationQuestionSetsRouter)
app.use('/api/reviewQuestions', reviewQuestionSetsRouter)
app.use('/api/customerReviewQuestions', customerReviewQuestionSetsRouter)
app.use('/api/email', emailRouter)
app.use('/api/registrationManagement', registrationManagementRouter)
app.use('/api/groups', groupRouter)
app.use('/api/peerreview', peerReview)
app.use('/api/customerReview', customerReview)
app.use('/api/autocomplete', autoCompleteRouter)
app.use('/api/instructorreview', instructorReviewRouter)

// Database connection
const db = require('./models')
db.connect()

// Initialize server
const PORT = config.port
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  // Close database connection
  db.sequelize
    .close()
    .then(() => console.log('client has disconnected'))
    .catch((err) => console.error('error during disconnection', err.stack))
})

module.exports = {
  app,
  server
}
