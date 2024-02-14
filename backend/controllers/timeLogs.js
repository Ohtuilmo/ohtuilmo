
const timeLogsRouter = require('express').Router()
const { checkLogin } = require('../middleware')
const db = require('../models/index')
const { Sequelize } = require('sequelize')


// Mock-data tuntikirjauksille

// const timeLogs = [
//   {
//     id: 1,
//     studentNumber:
//       '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
//     sprint: 1,
//     date: '2023-01-15',
//     minutes: 50,
//     description: 'Frontend development',
//     tags: ['frontend', 'react'],
//     groupId: '23567836',
//   },
//   {
//     id: 2,
//     studentNumber:
//       '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
//     sprint: 1,
//     date: '2023-02-19',
//     minutes: 120,
//     description: 'Backend development',
//     tags: ['backend', 'node'],
//     groupId: '23567836',
//   },
//   {
//     id: 3,
//     studentNumber:
//       '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
//     sprint: 2,
//     date: '2023-02-25',
//     minutes: 80,
//     description: 'Backend development',
//     tags: ['backend', 'node'],
//     groupId: '23567836',
//   },
//   {
//     id: 4,
//     studentNumber:
//       '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
//     sprint: 2,
//     date: '2023-02-23',
//     minutes: 100,
//     description: 'Wrote unit tests.',
//     tags: ['backend'],
//     groupId: '23567836',
//   },
//   {
//     id: 5,
//     studentNumber:
//       '10f8bdef82c62acf57da2c7bf8064641fb14f7b07f49b3f2f3316bf697ea3706',
//     sprint: 1,
//     date: '2023-01-17',
//     minutes: 30,
//     description: 'Customer meeting',
//   },
//   {
//     id: 6,
//     studentNumber:
//       '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
//     sprint: 1,
//     date: '2023-01-19',
//     minutes: 220,
//     description: 'Reviewed a PR from Pekka.',
//     tags: ['backend'],
//     groupId: '23567836',
//   },
//   {
//     id: 7,
//     studentNumber:
//       '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
//     sprint: 3,
//     date: '2023-03-01',
//     minutes: 120,
//     description: 'Refactored code.',
//     tags: ['backend'],
//     groupId: '23567836',
//   },
// ]

// TODO: validate date field

const validateTimeEntry = ({ sprint, date, minutes, description }) => {
  if (!sprint || !date || isNaN(parseFloat(minutes)) || !description) {
    return 'All fields must be filled.'
  }
  if (parseFloat(minutes) <= 0) {
    return 'Minutes must be a positive number.'
  }
  if (description.length < 5) {
    return 'Description must be over 5 characters.'
  }
  return null
}


const fetchFromDb = async (studentNumber) => {
  try {
    const raw_logs = await db.TimeLog.findAll({
      where: { student_number: studentNumber },
      attributes: [
        ['id', 'id'],
        ['date', 'date'],
        ['minutes', 'minutes'],
        ['student_number', 'studentNumber'],
        'description',
        [Sequelize.literal('sprint.sprint'), 'sprint'],
        [Sequelize.literal('group_id'), 'groupId'],
      ],
      include: [
        {
          model: db.Sprint,
          as: 'sprint',
          attributes: [],
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['title'],
          through: { attributes: [] }
        }
      ],
      raw: true,
    })

    const timeLogMap = new Map()
    raw_logs.forEach(log => {
      const { id, studentNumber, sprint, date, minutes, description, groupId, ...rest } = log
      const formattedDate = new Date(date).toISOString().slice(0, 10)
      const timeLog = timeLogMap.get(id) || { id, studentNumber, sprint, date: formattedDate, minutes, description, groupId, tags: [] }
      const tag = rest['tags.title']
      if (tag) {
        timeLog.tags.push(tag)
      }
      timeLogMap.set(id, timeLog)
    })
    return Array.from(timeLogMap.values())
  } catch (error) {
    console.error('Error fetching time logs:', error)
    throw new Error('Error fetching time logs.')
  }
}

timeLogsRouter.get('/', checkLogin, async (req, res) => {
  try {
    const user_id = req.user.id
    const timeLogs = await fetchFromDb(user_id)
    return res.status(200).json(timeLogs)
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching time logs.' })
  }
})

timeLogsRouter.post('/', checkLogin, async (req, res) => {
  const { sprint, date, minutes, description, tags, groupId } = req.body
  const studentNumber = req.user.id
  const newLog = {
    studentNumber,
    sprint,
    date,
    minutes,
    description,
    tags,
    groupId,
  }

  const error = validateTimeEntry(newLog)
  if (error) {
    console.log('error:', error)
    return res.status(400).json({ error })
  }

  try {
    const sprintRecord = await db.Sprint.findOne({
      where: {
        sprint: sprint,
        group_id: groupId
      }
    })
    if (!sprintRecord) {
      return res.status(404).json({ error: 'Sprint not found.' })
    }

    const sprintId = sprintRecord.id

    await db.TimeLog.create({
      student_number: studentNumber,
      sprint_id: sprintId,
      date: date,
      minutes: minutes,
      description: description,
    })

    const timeLogs = await fetchFromDb(studentNumber)
    return res.status(201).json(timeLogs)
  } catch (error) {
    console.log('error:', error)
    return res.status(500).json({ error: 'Error creating time log.' })
  }
})

timeLogsRouter.delete('/:id', checkLogin, async (req, res) => {
  const id = parseInt(req.params.id)
  const userId = req.user.id

  try {
    const timeLog = await db.TimeLog.findOne({ where: { id: id, student_number: userId } })

    if (!timeLog) {
      return res.status(404).json({ error: 'Time log not found or unauthorized to delete' })
    }

    await db.TimeLog.destroy({ where: { id: id } })
    const timeLogs = await fetchFromDb(userId)
    return res.status(200).json(timeLogs)
  } catch (error) {
    console.error('Error deleting time log:' , error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = timeLogsRouter