const timeLogsRouter = require('express').Router()
const { checkLogin } = require('../middleware')
const db = require('../models/index')
const { Sequelize } = require('sequelize')

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
    const rawLogs = await db.TimeLog.findAll({
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
          through: { attributes: [] },
        },
      ],
      raw: true,
    })

    const timeLogMap = new Map()
    rawLogs.forEach((log) => {
      const {
        id,
        studentNumber,
        sprint,
        date,
        minutes,
        description,
        groupId,
        ...rest
      } = log
      const formattedDate = new Date(date).toISOString().slice(0, 10)
      const timeLog = timeLogMap.get(id) || {
        id,
        studentNumber,
        sprint,
        date: formattedDate,
        minutes,
        description,
        groupId,
        tags: [],
      }
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
    console.error('error:', error)
    return res.status(400).json({ error })
  }

  try {
    const sprintRecord = await db.Sprint.findOne({
      where: {
        sprint: sprint,
        group_id: groupId,
      },
    })
    if (!sprintRecord) {
      return res.status(404).json({ error: 'Sprint not found.' })
    }

    const sprintId = sprintRecord.id

    const timeLog = await db.TimeLog.create({
      student_number: studentNumber,
      sprint_id: sprintId,
      date: date,
      minutes: minutes,
      description: description,
    })

    if (tags && tags.length > 0) {
      const tagObjects = await db.Tag.findAll({
        where: {
          title: tags,
        },
      })

      const tagIds = tagObjects.map((tag) => tag.id)
      await timeLog.addTags(tagIds)
    }

    const timeLogs = await fetchFromDb(studentNumber)
    return res.status(201).json(timeLogs)
  } catch (error) {
    console.error('error:', error)
    return res.status(500).json({ error: 'Error creating time log.' })
  }
})

timeLogsRouter.delete('/:id', checkLogin, async (req, res) => {
  const id = parseInt(req.params.id)
  const userId = req.user.id

  try {
    const timeLog = await db.TimeLog.findOne({
      where: { id: id, student_number: userId },
    })

    if (!timeLog) {
      return res
        .status(404)
        .json({ error: 'Time log not found or unauthorized to delete' })
    }

    await db.TimeLog.destroy({ where: { id: id } })
    const timeLogs = await fetchFromDb(userId)
    return res.status(200).json(timeLogs)
  } catch (error) {
    console.error('Error deleting time log:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = timeLogsRouter
