'use strict'

const newUsers = [
  {
    student_number: '011120775',
    username: 'mluukkai',
    first_names: 'Matti',
    last_name: 'Luukkainen',
    email: 'eiainakaanluukkaisensäpö@example.com',
    admin: true,
    created_at: new Date(),
    updated_at: new Date()
  }
]

module.exports = {
  up: async (query) => {
    await query.bulkInsert('users', newUsers, {})
  },

  down: async (query) => {
    await query.bulkDelete('users', { username: [ 'mluukkai' ] }, {})
  }
}
