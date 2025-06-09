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

const moveTimeLogToSprint = (direction) => (async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const timeLog = await db.TimeLog.findOne({
      where:{ id: id }
    })
    if (!timeLog) {
      res
        .status(404)
        .json({ error: 'Time log not found or unauthorized to move' })
    }
    const currentSprint = await db.Sprint.findOne({
      where:{ id: timeLog.sprint_id }
    })
    const previousSprint = await db.Sprint.findOne({
      where:{ sprint: currentSprint.sprint - 1, group_id: currentSprint.group_id }
    })
    const nextSprint = await db.Sprint.findOne({
      where:{ sprint: currentSprint.sprint + 1, group_id: currentSprint.group_id }
    })
    if (direction === 'previous') {
      if (!previousSprint) {
        res
          .status(404)
          .json({ error: 'Previous sprint not found' })
      }
      timeLog.sprint_id = previousSprint.id
    } else if (direction === 'next') {
      if (!nextSprint) {
        res
          .status(404)
          .json({ error: 'Next sprint not found' })
      }
      timeLog.sprint_id = nextSprint.id
    } else {
      res
        .status(400)
        .json({ error: 'Invalid direction' })
    }
    await timeLog.save()
    const timeLogs = await fetchAllFromDb()
    res.status(200).json(timeLogs)
  } catch (error) {
    res.status(500).send(`${error.name}: ${error.message}`)
  }
})

instructorTimeLogsRouter.patch('/:id/moveToPrevious', checkInstructor, moveTimeLogToSprint('previous'))
instructorTimeLogsRouter.patch('/:id/moveToNext', checkInstructor, moveTimeLogToSprint('next'))

instructorTimeLogsRouter.delete('/:id', checkInstructor, async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const timeLog = await db.TimeLog.findOne({
      where: { id: id },
    })
    if (!timeLog) {
      res
        .status(404)
        .json({ error: 'Time log not found' })
    }
    await db.TimeLog.destroy({ where: { id: id } })
    const timeLogs = await fetchAllFromDb()
    res.status(200).json(timeLogs)
  } catch (error) {
    console.error('Error deleting time log:', error)
    res.status(500).send(`${error.name}: ${error.message}`)
  }
})

module.exports = instructorTimeLogsRouter
