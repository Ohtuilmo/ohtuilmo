import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import config from './config/index'
import { test_user } from './config/dev'

interface TokenQuery {
  token: string
}

const isTokenQuery = (query: unknown): query is TokenQuery => {
  return !!query && typeof query === "object" && "token" in query && typeof query.token === "string"
}

const getTokenFrom = (req: Request<unknown, unknown, unknown, unknown>) => {
  const authorization = req.headers.authorization || (isTokenQuery(req.query) ? req.query.token : undefined)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring('bearer '.length)
  }
  return null
}

const authenticateToken = (req: Request) => {
  const token = getTokenFrom(req)
  if (token === null) {
    return {
      error: 'token missing or invalid',
      status: 401,
    }
  }

  try {
    const decodedToken = jwt.verify(token, config.secret)
    if (!decodedToken || (typeof decodedToken !== "string" && !decodedToken.id)) {
      return {
        error: 'token missing or invalid',
        status: 401,
      }
    }

    return {
      token: decodedToken,
      status: 200
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
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

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error, status, token } = authenticateToken(req)
  if (!token) {
    return res.status(status).json({ error })
  }

  req.user = token
  next()
}

const checkInstructor = (req: Request, res: Response, next: NextFunction) => {
  const { error, status, token } = authenticateToken(req)
  if (!token) {
    return res.status(status).json({ error })
  }

  if (typeof token !== "string" && !token.instructor && !token.admin) {
    return res.status(401).json({ error: 'not instructor' })
  }

  req.user = token
  next()
}

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { error, status, token } = authenticateToken(req)
  if (!token) {
    return res.status(status).json({ error })
  }

  if (typeof token !== "string" && !token.admin) {
    return res.status(401).json({ error: 'not admin' })
  }

  req.user = token
  next()
}

export const fakeshibbo = (req: Request, _res: Response, next: NextFunction) => {
  const user = test_user.test_user

  req.headers.employeenumber = user.employeenumber
  req.headers.mail = user.mail
  req.headers.hypersonstudentid = user.hypersonstudentid
  req.headers.uid = user.uid
  req.headers.givenname = user.givenname
  req.headers.sn = user.sn
  next()
}

export const logger = (request: Request, _response: Response, next: NextFunction) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

export default {
  checkLogin,
  checkInstructor,
  checkAdmin,
  logger,
  fakeshibbo,
}
