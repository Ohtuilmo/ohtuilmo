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
  req.headers.employeenumber = ''
  req.headers.mail = ''
  req.headers.hypersonstudentid = 'cc813e63a2db036a5e69de6024e8222d40646d7a55937159dda9d231c4d9caeb'
  req.headers.uid = 'haisleymorgan650'
  req.headers.givenname = 'Morgan'
  req.headers.sn = 'Haisley'
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
  checkAdmin,
  logger,
  fakeshibbo,
}
