const groupSprintSummaryRouter = require('express').Router()
const { checkLogin } = require('../middleware')
const db = require('../models/index')


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
  const group = await db.Group.findByPk(groupId)
  if (!group) {
    console.log('Group not found')
    return false
  }
  const isMember = await group.hasStudent(userId)
  const isInstructor = group.instructorId === userId

  return isMember || isInstructor
}

const getGroupSprintSummary = async (groupId) => {

  const sprints = await db.Sprint.findAll({
    where: { group_id: groupId },
    attributes: [
      'id',
      'sprint'
    ]
  })

  const sprintIds = sprints.map(sprint => sprint.id)

  const rawLogs = await db.TimeLog.findAll({
    where: { sprint_id: { [db.Sequelize.Op.in]: sprintIds } },
    attributes: [
      'sprint_id',
      'student_number',
      [db.Sequelize.fn('sum', db.Sequelize.col('minutes')), 'total_minutes']
    ],
    group: ['sprint_id', 'student_number']
  })

  const studentNumbers = rawLogs.map(log => log.student_number)
  const users = await db.User.findAll({
    where: { student_number: { [db.Sequelize.Op.in]: studentNumbers } },
    attributes: ['student_number', 'first_names', 'last_name']
  })

  const nameMap = users.reduce((map, user) => {
    const firstName = user.first_names.split(' ')[0]
    map[user.student_number] = `${firstName} ${user.last_name}`
    return map
  }, {})


  const logsMap = rawLogs.reduce((map, log) => {
    if (!map[log.sprint_id]) {
      map[log.sprint_id] = {}
    }
    const name = nameMap[log.student_number]
    map[log.sprint_id][name] = log.dataValues.total_minutes
    return map
  }, {})


  const result = sprints.map(sprint => ({
    [sprint.sprint]: Object.entries(logsMap[sprint.id] || {}).map(([name, total_minutes]) => ({
      [name]: parseInt(total_minutes, 10) || 0
    }))
  }))

  return JSON.stringify(result, null, 2)
}

groupSprintSummaryRouter.get('/:id', checkLogin, async (req, res) => {
  const groupId = req.params.id
  const userId = req.user.id
  const isAdmin = req.user.admin
  //console.log('groupId: ', groupId)

  const access = await validateAccess(groupId, userId) || isAdmin
  //console.log(access)

  if (access) {
    //console.log('Access granted')
    const result = await getGroupSprintSummary(groupId)
    console.log('result: ', result)
    return res.status(200).json(result)
  }
  console.error('Group not found or user not authorized.')
  return res.status(403).json({ error: 'Group not found or user not authorized.' })

})



module.exports = groupSprintSummaryRouter
