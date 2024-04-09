const express = require('express')
const { checkLogin } = require('../middleware')

const sprintsRouter = express.Router()
const db = require('../models/index')


// latest group, because student may belong to multiple groups (dropout, etc.)
const findLatestGroupId = async (studentNumber) => {
  const latestGroup = await db.Group.findOne({
    include: [{
      model: db.User,
      as: 'students',
      where: { student_number: studentNumber }
    }],
    order: [['createdAt', 'DESC']]
  })
  if (!latestGroup) {
    throw new Error('User does not belong to any group or not found.')
  } else {
    return latestGroup.id
  }
}

const findLatestSprint = async groupId => {
  const latestSprint = await db.Sprint.findOne({
    include: [{
      model: db.Group,
      as: 'group',
      where: { id: groupId }
    }],
    order: [['sprint', 'DESC']]
  })
  return latestSprint
}

const validateSprint = ({ start_date, end_date, sprint }, latest) => {
  const startDate = new Date(start_date)
  const endDate = new Date(end_date)
  const latestEndDate = new Date(latest.end_date)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Start date or end date is invalid.')
  }
  if (startDate >= endDate) {
    throw new Error('Start date must be before end date.')
  }
  if (startDate <= latestEndDate) {
    throw new Error('New sprint must start after the latest sprint.')
  }

  if (typeof sprint !== 'number' || isNaN(sprint) || parseInt(sprint, 10) !== sprint) {
    throw new Error('Sprint must be a valid number.')
  }
  if (!!latest.sprint && sprint !== latest.sprint+1) {
    throw new Error('New sprint must be the successor for the latest sprint.')
  }
}

const fetchSprintsFromDb = async (studentNumber) => {
  const latestGroupId = await findLatestGroupId(studentNumber)

  const groupSprints = await db.Sprint.findAll({
    where: { group_id: latestGroupId },
    //add group_id to attributes if needed for frontend
    attributes: ['id', 'start_date', 'end_date', 'sprint'],
    raw: true
  })

  const formattedSprints = groupSprints.map(sprint => ({
    id: sprint.id,
    start_date: new Date(sprint.start_date).toISOString().slice(0, 10),
    end_date: new Date(sprint.end_date).toISOString().slice(0, 10),
    sprint: sprint.sprint,
    user_id: studentNumber
  }))

  return formattedSprints
}

sprintsRouter.get('/', checkLogin, async (req, res) => {
  const user_id = req.user.id

  if (!user_id) {
    return res.status(400).json({ error: 'User id is missing.' })
  }

  try {
    const sprints = await fetchSprintsFromDb(user_id)
    res.status(200).json(sprints)
  } catch (error) {
    const errorMessage = 'Error fetching sprints: ' + error.message
    console.error(errorMessage)
    return res.status(500).json({ error: errorMessage })
  }
})

sprintsRouter.post('/', checkLogin, async (req, res) => {
  const { start_date, end_date, sprint, user_id } = req.body

  try {
    const groupId = await findLatestGroupId(user_id)
    let latestSprint = await findLatestSprint(groupId)
    if (!latestSprint) latestSprint = { end_date: null, sprint: null }

    try {
      validateSprint(req.body, latestSprint)
    } catch (error) {
      const errorMessage = 'Error validating sprint:' + error.message
      console.error(errorMessage)
      return res.status(400).json({ error: errorMessage })
    }

    await db.Sprint.create({
      start_date,
      end_date,
      sprint,
      group_id: groupId
    })
    const sprints = await fetchSprintsFromDb(user_id)
    res.status(201).json(sprints)
  } catch (error) {
    const errorMessage = 'Error creating sprint:' + error.message
    console.error(errorMessage)
    return res.status(500).json({ error: errorMessage })
  }
})

sprintsRouter.delete('/:id', checkLogin, async (req, res) => {
  const id = parseInt(req.params.id)
  const user_id = req.user.id

  try {
    const sprint = await db.Sprint.findOne({ where: { id } })
    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found.' })
    }
    const group = await db.Group.findOne({ where: { id: sprint.group_id } })
    if (!group) {
      return res.status(404).json({ error: 'Group not found for the sprint.' })
    }
    const isMember = await group.hasStudent(user_id)
    if (!isMember) {
      return res.status(403).json({ error: 'User is not a member of the group.' })
    }
    await sprint.destroy()
    const sprints = await fetchSprintsFromDb(user_id)
    res.status(200).json(sprints)
  } catch (error) {
    const errorMessage = 'Error deleting sprint:' + error.message
    console.error(errorMessage)
    return res.status(500).json({ error: errorMessage })
  }
})

module.exports = sprintsRouter
