const timeLoggingRouter = require('express').Router()
// eslint-disable-next-line no-unused-vars
const { checkLogin, checkAdmin } = require('../middleware')


// Mock-data tuntikirjauksille
const timeEntries = [
  {
    id: 1,
    studentNumber: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
    sprint: 1,
    date: '2023-01-15',
    minutes: 50,
    description: 'Frontend development',
    tags: ['frontend', 'react'],
    groupId: '23567836',
  },
  {
    id: 2,
    studentNumber: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
    sprint: 1,
    date: '2023-02-19',
    minutes: 120,
    description: 'Backend development',
    tags: ['backend', 'node'],
    groupId: '23567836',
  },
  {
    id: 3,
    studentNumber: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
    sprint: 2,
    date: '2023-02-25',
    minutes: 80,
    description: 'Backend development',
    tags: ['backend', 'node'],
    groupId: '23567836',
  },
  {
    id: 4,
    studentNumber: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
    sprint: 2,
    date: '2023-02-23',
    minutes: 100,
    description: 'Wrote unit tests.',
    tags: ['backend'],
    groupId: '23567836',
  },
  {
    id: 5,
    studentNumber: '10f8bdef82c62acf57da2c7bf8064641fb14f7b07f49b3f2f3316bf697ea3706',
    sprint: 1,
    date: '2023-01-17',
    minutes: 30,
    description: 'Customer meeting'
  },
  {
    id: 6,
    studentNumber: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
    sprint: 1,
    date: '2023-01-19',
    minutes: 220,
    description: 'Reviewed a PR from Pekka.',
    tags: ['backend'],
    groupId: '23567836',
  },
  {
    id: 7,
    studentNumber: '8668e87f3f7cbff3067731ed4a181879949716608e4fa93a9ded969d1d2626f3',
    sprint: 3,
    date: '2023-03-01',
    minutes: 120,
    description: 'Refactored code.',
    tags: ['backend'],
    groupId: '23567836',
  },
]

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

timeLoggingRouter.get('/', checkLogin, async (req, res) => {
  const user_id = req.user.id
  console.log('req.user:', req.user)

  const entries = timeEntries.filter(entry => entry.studentNumber === user_id)

  res.status(200).json(entries)
})


timeLoggingRouter.post('/', checkLogin, (req, res) => {
  const { sprint, date, minutes, description } = req.body
  const user_id = req.user.id

  const newEntry = { user_id, sprint, date, minutes, description }

  const error = validateTimeEntry(newEntry)
  if (error) {
    return res.status(400).json({ error })
  }

  timeEntries.push(newEntry)

  res.status(201).json(newEntry)
})

timeLoggingRouter.delete('/:id', checkLogin, (req, res) => {
  const id = parseInt(req.params.id)
  const index = timeEntries.findIndex(entry => entry.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Entry not found.' })
  }
  timeEntries.splice(index, 1)
  res.status(204).end()
})

module.exports = timeLoggingRouter