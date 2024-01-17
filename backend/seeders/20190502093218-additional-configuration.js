'use strict'

/**
 * Additional configuration for instructorpage e2e tests
 */

const additionalConfiguration = [
  {
    name: 'Konfiguraatio 2',
    registration_question_set_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]

module.exports = {
  up: async (query) => {
    await query.bulkInsert('configurations', additionalConfiguration, {})
  },

  down: async (query) => {
    await query.bulkDelete('configurations', { name: 'Konfiguraatio 2' }, {})
  }
}
