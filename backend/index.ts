import http from 'http'
import express from 'express'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { logger, fakeshibbo } from './middleware'
import { isDevelopmentEnvironment } from './utils/index'
import headersMiddleware from 'unfuck-utf8-headers-middleware'
import config from './config/'

const app = express()


var unless = (path: string, middleware: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
  'sn', // Last name
]

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: '100mb' }))
app.use(headersMiddleware(shibbolethHeaders))
isDevelopmentEnvironment() && app.use(fakeshibbo)
app.use(unless('/api/login', logger))

// Node env
console.log('NODE_ENV:', process.env.NODE_ENV)

// Database connection
import db from './models'
db.connect()

// Routers
import loginRouter from './controllers/login'
import logoutRouter from './controllers/logout'
import topicsRouter from './controllers/topics'
import topicDatesrouter from './controllers/topicDates'
import tokenCheckRouter from './controllers/tokenCheck'
import registrationRouter from './controllers/registrations'
import usersRouter from './controllers/users'
import configurationsRouter from './controllers/configurations'
import registrationQuestionSetsRouter from './controllers/registrationQuestionSets'
import reviewQuestionSetsRouter from './controllers/reviewQuestionSets'
import customerReviewQuestionSetsRouter from './controllers/customerReviewQuestionSets'
import { emailRouter } from './controllers/email'
import registrationManagementRouter from './controllers/registrationManagement'
import groupRouter from './controllers/groups'
import peerReview from './controllers/peerReview'
import customerReview from './controllers/customerReview'
import autoCompleteRouter from './controllers/autocomplete'
import instructorReviewRouter from './controllers/instructorReview'
import timeLogsRouter from './controllers/timeLogs'
import instructorTimeLogsRouter from './controllers/instructorTimeLogs'
import sprintRouter from './controllers/sprints'
import groupSprintSummaryRouter from './controllers/groupSprintSummary'
import tagsRouter from './controllers/tags'
import devRouter from './controllers/dev'
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
app.use('/api/timelogs', timeLogsRouter)
app.use('/api/instructorTimeLogs', instructorTimeLogsRouter)
app.use('/api/sprints', sprintRouter)
app.use('/api/groupSprintSummary', groupSprintSummaryRouter)
app.use('/api/tags', tagsRouter)
if (process.env.NODE_ENV === 'development')
  app.use('/api/role', devRouter)


// Initialize server
const PORT = config.port
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', async () => {
  // Close database connection
  console.log('Closing the server and connection to database')
  try {
    await db.sequelize!.close()
    console.log('client has disconnected')
  } catch(err) {
    if (err instanceof Error) {
      return console.error('error during disconnection', err.stack)
    }
    console.error("Unknown error:", err)
  }
})

export default {
  app,
  server,
  db
}
