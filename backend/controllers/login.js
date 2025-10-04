const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../config/')
const db = require('../models/index')

const handleDatabaseError = (res, error) => {
  console.log(error)
  res
    .status(500)
    .json({ error: 'Something is wrong... try reloading the page' })
}

const userIsInstructorForCurrentGroup = async (student_number) => {
  try {
    const latestConfigurationId = await db.Configuration.findOne({
      order: [['created_at', 'DESC']],
      attributes: ['id']
    })

    if (!latestConfigurationId) {
      return false
    }

    const group = await db.Group.findOne({
      where: {
        configuration_id: latestConfigurationId.id,
        instructor_id: student_number
      }
    })
    return group
  } catch (error) {
    console.error('Error checking if active instructor:', error)
    return false
  }
}

loginRouter.post('/', async (req, res) => {
  const student_number = req.headers.hypersonstudentid || req.headers.schacpersonaluniquecode

  console.log('[Login] Student number from headers:', student_number)

  if (!student_number)
    return res
      .status(401)
      .set('Cache-Control', 'no-store')
      .json({ error: 'Student number missing from headers.' })
      .end()

  db.User.findOne({
    where: { student_number },
  })
    .then((foundUser) => {
      if (foundUser) {
        console.log('[Login] user found')
        //user already in database, no need to add
        const token = jwt.sign(
          { id: foundUser.student_number, admin: foundUser.admin,
            instructor: userIsInstructorForCurrentGroup(foundUser.student_number) },
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
        db.User.create({
          username: req.headers.uid,
          student_number,
          first_names: req.headers.givenname,
          last_name: req.headers.sn,
          email: req.headers.mail,
          admin: false,
        })
          .then((savedUser) => {
            const token = jwt.sign(
              { id: savedUser.student_number, admin: savedUser.admin },
              config.secret
            )
            console.log('[Login] return')
            return res.status(200).set('Cache-Control', 'no-store').json({
              token,
              user: savedUser,
            })
          })
          .catch((error) => handleDatabaseError(res, error))
      }
    })
    .catch((error) => handleDatabaseError(res, error))
})

module.exports = loginRouter
