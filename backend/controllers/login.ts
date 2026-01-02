import { Request, Response } from "express"
import express from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/index'
import db from '../models/index'

const loginRouter = express.Router()

const handleDatabaseError = (res: Response, error: unknown) => {
  console.log(error)
  res
    .status(500)
    .json({ error: 'Something is wrong... try reloading the page' })
}

const userIsInstructorForCurrentGroup = async (student_number: string | number) => {
  try {
    const group = await db.Group.findOne({
      where: {
        instructor_id: student_number
      },
      include: {
        model: db.Configuration,
        as: 'configuration',
        where: {
          active: true
        }
      }
    })
    return group ? true : false
  } catch (error) {
    console.error('Error checking if active instructor:', error)
    return false
  }
}

loginRouter.post('/', async (req: Request, res: Response) => {
  const student_number = req.headers.hypersonstudentid || req.headers.schacpersonaluniquecode

  console.log('[Login] Student number from headers:', student_number)

  if (!student_number)
    return res
      .status(401)
      .set('Cache-Control', 'no-store')
      .json({ error: 'Student number missing from headers.' })
      .end()

  try {
    const foundUser = await db.User.findOne({
      where: { student_number },
    })

    if (foundUser) {
      console.log('[Login] user found')
      //user already in database, no need to add
      const token = jwt.sign(
        { id: foundUser.student_number, admin: foundUser.admin,
          instructor: await userIsInstructorForCurrentGroup(foundUser.student_number) },
        config.secret
      )
      console.log('[Login] return')
      return res.status(200).set('Cache-Control', 'no-store').json({
        token,
        user: foundUser,
      })
    } else {
      //user not in database, add user
      console.log('[Login] user not found')
      const savedUser = await db.User.create({
        username: req.headers.uid,
        student_number,
        first_names: req.headers.givenname,
        last_name: req.headers.sn,
        email: req.headers.mail,
        admin: false,
      })
      const token = jwt.sign(
        {
          id: savedUser.student_number,
          admin: savedUser.admin,
          instructor: await userIsInstructorForCurrentGroup(savedUser.student_number),
        },
        config.secret
      )
      console.log('[Login] return')
      return res.status(200).set('Cache-Control', 'no-store').json({
        token,
        user: savedUser,
      })
    }
  } catch(error) {
    handleDatabaseError(res, error)
  }
})

export default loginRouter
