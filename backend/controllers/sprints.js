const express = require('express')
const { checkLogin } = require('../middleware')

const sprintsRouter = express.Router()

let mockSprints = [
  {
    id: 1,
    start_date: '2024-02-01',
    end_date: '2024-02-14',
    sprint: 1,
    user_id: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
  },
  {
    id: 2,
    start_date: '2024-02-15',
    end_date: '2024-02-28',
    sprint: 2,
    user_id: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
  },
  {
    id: 3,
    start_date: '2024-02-29',
    end_date: '2024-03-06',
    sprint: 3,
    user_id: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
  },
  {
    id: 4,
    start_date: '2024-02-09',
    end_date: '2024-02-16',
    sprint: 1,
    user_id: '10f8bdef82c62acf57da2c7bf8064641fb14f7b07f49b3f2f3316bf697ea3706',
  }
]

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


sprintsRouter.get('/', checkLogin, (req, res) => {
  const user_id = req.user.id
  if (!user_id) {
    return res.status(400).json({ error: 'User id is missing.' })
  }
  const sprints = mockSprints.filter(s => s.user_id === user_id)
  res.status(200).json(sprints)
})

sprintsRouter.post('/', checkLogin, (req, res) => {
  const validationError = validateSprint(req.body)
  if (validationError) {
    return res.status(400).json({ error: validationError })
  }
  const { start_date, end_date, sprint, user_id } = req.body
  const newSprint = {
    id: mockSprints.length + 1,
    start_date,
    end_date,
    sprint,
    user_id,
  }

  mockSprints.push(newSprint)
  console.log('New sprint:', newSprint)
  const sprints = mockSprints.filter(s => s.user_id === user_id)
  res.status(201).json(sprints)
})

sprintsRouter.delete('/:id', checkLogin, async (req, res) => {
  const id = parseInt(req.params.id)
  const user_id = req.user.id
  const index = mockSprints.findIndex(s => s.id === id)

  if (index !== -1) {
    mockSprints = mockSprints.filter(s => s.id !== id)
    const sprints = mockSprints.filter(s => s.user_id === user_id)
    res.status(200).json(sprints)
  } else {
    res.status(404).json({ error: 'Sprint not found.' })
  }
})

module.exports = sprintsRouter
