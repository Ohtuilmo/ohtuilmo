const groupSprintSummaryRouter = require('express').Router()
const { checkLogin } = require('../middleware')
//const group = require('../models/group')
const db = require('../models/index')
const { Sequelize } = require('sequelize')


const fakeData =
  [
    {
      '1': [
        { 'Joonatan Huang': 120 },
        { 'Mikko Ahro': 150 },
        { 'Ella Virtanen': 130 },
        { 'Leo Niemi': 140 },
        { 'Noora Laine': 110 },
        { 'Sofia Heikkilä': 125 },
        { 'Antti Korhonen': 135 }
      ]
    },
    {
      '2': [
        { 'Joonatan Huang': 90 },
        { 'Mikko Ahro': 180 },
        { 'Ella Virtanen': 120 },
        { 'Leo Niemi': 160 },
        { 'Noora Laine': 105 },
        { 'Sofia Heikkilä': 135 },
        { 'Antti Korhonen': 140 }
      ]
    },
    {
      '3': [
        { 'Joonatan Huang': 200 },
        { 'Mikko Ahro': 160 },
        { 'Ella Virtanen': 150 },
        { 'Leo Niemi': 170 },
        { 'Noora Laine': 120 },
        { 'Sofia Heikkilä': 130 },
        { 'Antti Korhonen': 125 }
      ]
    }
  ]

const validateAccess = async (groupId, userId) => {
  const group = await db.Group.findOne({
    where: { id: groupId },
    include: [{
      model: db.User,
      as: 'students',
      attributes: ['id'],
    }],
  })

  if (!group) {
    return false
  }

  const isMember = group.students.some(student => student.id === userId)
  const isInstructor = group.instructorId === userId

  return isMember || isInstructor
}

const getGroupSprintSummary = async (groupId) => {
  const result = await db.TimeLog.findAll({
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('minutes')), 'totalMinutes'],
      [Sequelize.fn('split', Sequelize.col('user.first_names'), ' ')[0], 'firstName'],
      Sequelize.col('user.last_name'),
      Sequelize.col('sprint.sprint')
    ],
    include: [
      {
        model: db.User,
        attributes: [],
        where: { groupId: groupId }
      },
      {
        model: db.Sprint,
        attributes: []
      }
    ],
    group: ['sprint.id', 'user.id'],
    raw: true
  })

  const formattedResult = result.reduce((acc, row) => {
    const fullName = row.firstName + ' ' + row['user.last_name']
    if (!acc[row['sprint.sprint']]) {
      acc[row['sprint.sprint']] = []
    }
    acc[row['sprint.sprint']].push({ [fullName]: row.totalMinutes })
    return acc
  }, {})

  return Object.entries(formattedResult).map(([sprint, users]) => ({ [sprint]: users }))
}


groupSprintSummaryRouter.get('/:id', checkLogin, async (req, res) => {
  const groupId = req.params.id
  console.log('groupSprintSummary id:', groupId)
  const userId = req.user.id
  console.log('groupSprintSummary userId:', userId)
  const isAdmin = req.user.admin

  if (!validateAccess(groupId, userId) && !isAdmin) {
    return res.status(403).json({ error: 'Group not found or user not authorized.' })
  }

  getGroupSprintSummary(1).then(console.log).catch(console.error)

  return res.status(200).json(fakeData)
})



module.exports = groupSprintSummaryRouter
