'use strict'

const additionalUser = [
  {
    student_number: '999999999',
    username: 'testiadmin1',
    first_names: 'Haisley',
    last_name: 'Morgan',
    email: '',
    admin: true
  }
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
    await query.bulkInsert('users', addTimeStamps(additionalUser), {})
  },

  down: async (query) => {
    await query.bulkDelete('users', { student_number: '999999999' }, {})
  }
}
