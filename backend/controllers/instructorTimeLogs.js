const instructorTimeLogsRouter = require('express').Router()
const { checkInstructor } = require('../middleware')
const db = require('../models/index')
const { Sequelize } = require('sequelize')

const fetchAllFromDb = async () => {
  try {
    const rawLogs = await db.TimeLog.findAll({
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
      order: [
        ['date', 'DESC'],
        ['created_at', 'DESC'],
      ],
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

instructorTimeLogsRouter.get('/', checkInstructor, async (req, res) => {
  try {
    const timeLogs = await fetchAllFromDb()
    return res.status(200).json(timeLogs)
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching time logs.' })
  }
})

module.exports = instructorTimeLogsRouter
