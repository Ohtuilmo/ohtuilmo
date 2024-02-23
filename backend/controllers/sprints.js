const express = require('express')
const { checkLogin } = require('../middleware')

const sprintsRouter = express.Router()
const db = require('../models/index')


// latest group, because student may belong to multiple groups (dropout, etc.)
const findLatestGroupId = async (studentNumber) => {
  try {
    const latestGroup = await db.Group.findOne({
      include: [{
        model: db.User,
        as: 'students',
        where: { student_number: studentNumber }
      }],
      order: [['createdAt', 'DESC']]
    })
    if (!latestGroup) {
      console.error('User does not belong to any group or not found')
      throw new Error('User does not belong to any group or not found')
    }
    const latestGroupId = latestGroup.id
    return latestGroupId
  } catch (error) {
    console.error('Error finding latest group:', error)
    throw new Error('Error finding latest group.')
  }
}


function validateSprint({ start_date, end_date, sprint }) {
  const startDate = new Date(start_date)
  const endDate = new Date(end_date)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'Start date or end date is invalid.'
  }
  if (startDate >= endDate) {
    return 'Start date must be before end date.'
  }

  if (typeof sprint !== 'number' || isNaN(sprint) || parseInt(sprint, 10) !== sprint) {
    return 'Sprint must be a valid number.'
  }

  return null
}

const fetchSprintsFromDb = async (studentNumber) => {
  try {
    const latestGroupId = await findLatestGroupId(studentNumber)

    const groupSprints = await db.Sprint.findAll({
      where: { group_id: latestGroupId },
      //add group_id to attributes if needed for frontend
      attributes: ['id', 'start_date', 'end_date', 'sprint'],
      raw: true
    })

    if (groupSprints.length === 0) {
      console.error('No sprints found for the group')
      throw new Error('No sprints found for the group')
    }
    const formattedSprints = groupSprints.map(sprint => ({
      id: sprint.id,
      start_date: new Date(sprint.start_date).toISOString().slice(0, 10),
      end_date: new Date(sprint.end_date).toISOString().slice(0, 10),
      sprint: sprint.sprint,
      user_id: studentNumber
    }))

    return formattedSprints
  } catch (error) {
    console.error('Error fetching sprints:', error)
    throw new Error('Error fetching sprints.')
  }
}

sprintsRouter.get('/', checkLogin, async (req, res) => {
  const user_id = req.user.id

  if (!user_id) {
    return res.status(400).json({ error: 'User id is missing.' })
  }
  const sprints = await fetchSprintsFromDb(user_id)
  res.status(200).json(sprints)
})

sprintsRouter.post('/', checkLogin, async (req, res) => {
  const validationError = validateSprint(req.body)
  if (validationError) {
    return res.status(400).json({ error: validationError })
  }
  const { start_date, end_date, sprint, user_id } = req.body

  try {
    const groupId = await findLatestGroupId(user_id)
    if (!groupId) {
      return res.status(404).json({ error: 'Group not found for the user.' })
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
    console.error('Error creating sprint:', error)
    return res.status(500).json({ error: 'Error creating sprint.' })
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
    console.error('Error deleting sprint:', error)
    return res.status(500).json({ error: 'Error deleting sprint.' })
  }

})

module.exports = sprintsRouter
