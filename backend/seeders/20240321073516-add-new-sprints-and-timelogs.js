'use strict'

const initialSprints = [
  {
    start_date: '2024-01-15',
    end_date: '2024-01-21',
    sprint: 1,
    group_id: 1
  },
  {
    start_date: '2024-01-22',
    end_date: '2024-01-28',
    sprint: 2,
    group_id: 1
  },
  {
    start_date: '2024-01-29',
    end_date: '2024-02-11',
    sprint: 3,
    group_id: 1
  },
  {
    start_date: '2024-01-15',
    end_date: '2024-01-21',
    sprint: 1,
    group_id: 2
  },
  {
    start_date: '2024-01-22',
    end_date: '2024-02-04',
    sprint: 2,
    group_id: 2
  }
]

const initialTimeLogs = [
  {
    date: '2024-01-15',
    minutes: 120,
    description: 'Setting up the local environment',
    student_number: 112345700,
    sprint_id: 1
  },
  {
    date: '2024-01-16',
    minutes: 120,
    description: 'Customer meeting, backend setup',
    student_number: 112345701,
    sprint_id: 1
  },
  {
    date: '2024-01-18',
    minutes: 180,
    description: 'Added new features to the frontend',
    student_number: 112345700,
    sprint_id: 1
  },
  {
    date: '2024-01-22',
    minutes: 240,
    description: 'Docker study, setting up the CI/CD pipeline',
    student_number: 112345700,
    sprint_id: 2
  },
]


const addTimeStamps = (arr) => {
  return arr.map((item) => {
    return {
      ...item,
      created_at: new Date(),
      updated_at: new Date()
    }
  })
}


module.exports = {
  up: async (query) => {
    await query.bulkInsert('sprints', addTimeStamps(initialSprints), {})
    await query.bulkInsert('time_logs', addTimeStamps(initialTimeLogs), {})
  },

  down: async (query) => {
    await query.bulkDelete('sprints', null, {})
    await query.bulkDelete('time_logs', null, {})
  }
}