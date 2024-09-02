// @ts-check
const jwt = require('jsonwebtoken')
const config = require('./config')

/**
 * @typedef {import("express").Request} Request
 * @typedef {import("express").RequestHandler} RequestHandler
 */

/**
 * @param {Request} req
 * @returns {string | null}
 */
const getTokenFrom = (req) => {
  const authorization = req.headers.authorization || req.query.token
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring('bearer '.length)
  }

  return null
}

/** @param {Request} req */
const authenticateToken = (req) => {
  const token = getTokenFrom(req)
  if (token === null) {
    return {
      error: 'token missing or invalid',
      status: 401,
    }
  }

  try {
    const decodedToken = jwt.verify(token, config.secret)
    if (!decodedToken || !decodedToken.id) {
      return {
        error: 'token missing or invalid',
        status: 401,
      }
    }

    return {
      token: decodedToken,
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return {
        error: error.message,
        status: 401,
      }
    } else {
      return {
        error,
        status: 401,
      }
    }
  }
}

/** @type {RequestHandler} */
const checkLogin = (req, res, next) => {
  const { error, status, token } = authenticateToken(req)
  if (!token) {
    return res.status(status).json({ error })
  }

  req.user = token
  next()
}

/** @type {RequestHandler} */
const checkInstructor = (req, res, next) => {
  const { error, status, token } = authenticateToken(req)
  if (!token) {
    return res.status(status).json({ error })
  }

  if (!token.instructor && !token.admin) {
    return res.status(401).json({ error: 'not instructor' })
  }

  req.user = token
  next()
}

/** @type {RequestHandler} */
const checkAdmin = (req, res, next) => {
  const { error, status, token } = authenticateToken(req)
  if (!token) {
    return res.status(status).json({ error })
  }

  if (!token.admin) {
    return res.status(401).json({ error: 'not admin' })
  }

  req.user = token
  next()
}

/** @type {RequestHandler} */
const fakeshibbo = (req, res, next) => {
  const test_users = {
    student: {
      employeenumber: '',
      mail: '',
      hypersonstudentid: '112345701',
      uid: 'johnsmith',
      givenname: 'John',
      sn: 'Smith',
    },
    instructor: {
      employeenumber: '',
      mail: '',
      hypersonstudentid: '112345699',
      uid: 'olliohj',
      givenname: 'Olli',
      sn: 'Ohjaaja',
    },
    admin: {
      employeenumber: '',
      mail: '',
      hypersonstudentid: '011120775',
      uid: 'mluukkai',
      givenname: 'Matti',
      sn: 'Luukkainen',
    },
  }

  // select one of the following: student, instructor, admin
  const test_user = test_users.admin

  req.headers.employeenumber = test_user.employeenumber
  req.headers.mail = test_user.mail
  req.headers.hypersonstudentid = test_user.hypersonstudentid
  req.headers.uid = test_user.uid
  req.headers.givenname = test_user.givenname
  req.headers.sn = test_user.sn
  next()
}

/** @type {RequestHandler} */
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

module.exports = {
  checkLogin,
  checkInstructor,
  checkAdmin,
  logger,
  fakeshibbo,
}
