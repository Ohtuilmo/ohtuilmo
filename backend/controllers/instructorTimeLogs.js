const instructorTimeLogsRouter = require('express').Router()
const { checkLogin } = require('../middleware')
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

const fetchGroupIdsFromLatestConfiguration = async () => {
  try {
    const latestConfigurationId = await db.Configuration.findOne({
      order: [['created_at', 'DESC']],
      attributes: ['id']
    })

    const groups = await db.Group.findAll({
      where: {
        configuration_id: latestConfigurationId.id
      }
    })
    return groups.map(group => group.id)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return false
  }
}

instructorTimeLogsRouter.get('/', checkLogin, async (req, res) => {
  try {
    if (req.user.admin ) {
      const timeLogs = await fetchAllFromDb()
      return res.status(200).json(timeLogs)
    } else if (req.user.instructor) {
      const timeLogs = await fetchAllFromDb()
      const activeGroupIds = await fetchGroupIdsFromLatestConfiguration()
      const filteredTimeLogs = timeLogs.filter(log => activeGroupIds.includes(log.groupId))
      return res.status(200).json(filteredTimeLogs)
    }
    return res.status(302).json({ error: 'Not authorized.' })
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching time logs.' })
  }
})

module.exports = instructorTimeLogsRouter
