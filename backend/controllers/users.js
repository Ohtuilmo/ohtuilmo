const usersRouter = require('express').Router()
const db = require('../models/index')
const { checkLogin, checkInstructor, checkAdmin } = require('../middleware')

usersRouter.put('/:studentNumber', checkLogin, async (req, res) => {
  const { email } = req.body
  const { studentNumber } = req.params

  if (req.user.id !== studentNumber) {
    return res.status(401).json({ error: 'student numbers not matching' })
  }

  if (!email) {
    return res.status(400).json({ error: 'missing email' })
  }

  try {
    const user = await db.User.findOne({
      where: { student_number: studentNumber }
    })
    if (!user) {
      return res.status(400).json({ error: 'user does not exist' })
    }

    const updatedUser = await user.update({ email })
    const refreshedUser = await updatedUser.reload()
    res.status(200).json({ user: refreshedUser })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something is wrong... try reloading the page' })
  }
})

// If the user is an instructor, the get all of the student numbers for
// the students in the current configuration, then gets the corresponding
// users from the database.
usersRouter.get('/', checkInstructor, async (req, res) => {
  if (req.user.admin) {
    try {
      const users = await db.User.findAll()
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something is wrong... try reloading the page' })
    }
  } else {
    try {
      const configuration = await db.Configuration.findOne({
        order: [['createdAt', 'DESC']]
      })
      const groups = await db.Group.findAll({
        where: { configurationId: configuration.id },
        include: [{ model: db.User, as: 'students' }],
      })
      const studentNumbersInGroups = groups.map(
        group => group.students.map(
          student => student.student_number)).flat()

      const users = await db.User.findAll({
        where: { student_number: studentNumbersInGroups }
      })
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something is wrong... try reloading the page' })
    }
  }
})

usersRouter.get('/isInstructor', checkLogin, async (req, res) => {
  try {
    const instructedGroups = await db.Group.findAll({
      where: { instructorId: req.user.id }
    })
    if (instructedGroups.length > 0) {
      res.status(200).json({ isInstructor: true })
    } else {
      res.status(200).json({ isInstructor: false })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something is wrong... try reloading the page' })
  }
})

module.exports = usersRouter
