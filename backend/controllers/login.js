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

const checkIfActiveInstructor = async (student_number) => {
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
    return group.length > 0
  } catch (error) {
    console.error('Error checking if active instructor:', error)
    return false
  }
}

loginRouter.post('/', async (req, res) => {
  if (!req.headers.hypersonstudentid)
    return res
      .status(401)
      .set('Cache-Control', 'no-store')
      .json({ error: 'Student number missing from headers.' })
      .end()

  const student_number = req.headers.hypersonstudentid

  db.User.findOne({
    where: { student_number },
  })
    .then((foundUser) => {
      if (foundUser) {
        //user already in database, no need to add
        const token = jwt.sign(
          { id: foundUser.student_number, admin: foundUser.admin,
            instructor: checkIfActiveInstructor(foundUser.student_number) },
          config.secret
        )
        return res.status(200).set('Cache-Control', 'no-store').json({
          token,
          user: foundUser,
        })
      } else {
        //user not in database, add user
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
