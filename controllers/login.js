const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../config/')
const db = require('../models/index')

const handleDatabaseError = (res, error) => {
  console.log(error)
  res.status(500).json({ error: 'database error' })
}

loginRouter.post('/', async (req, res) => {
  db.User.findOne({
    where: {
      student_number: req.headers.schacpersonaluniquecode
        ? req.headers.schacpersonaluniquecode.split(':')[6]
        : null
    }
  })
    .then((foundUser) => {
      if (foundUser) {
        //user already in database, no need to add
        const token = jwt.sign(
          { id: foundUser.student_number, admin: foundUser.admin },
          config.secret
        )
        return res.status(200).json({
          token,
          user: foundUser
        })
      } else {
        //user not in database, add user
        db.User.create({
          username: req.headers.uid,
          student_number: req.headers.schacpersonaluniquecode.split(':')[6],
          first_names: req.headers.givenname,
          last_name: req.headers.sn,
          email: req.headers.mail,
          admin: false
        })
          .then((savedUser) => {
            const token = jwt.sign(
              { id: savedUser.student_number, admin: savedUser.admin },
              config.secret
            )
            return res.status(200).json({
              token,
              user: savedUser
            })
          })
          .catch((error) => handleDatabaseError(res, error))
      }
    })
    .catch((error) => handleDatabaseError(res, error))
})

module.exports = loginRouter
