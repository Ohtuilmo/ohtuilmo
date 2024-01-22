'use strict'

const additionalTopic = [
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'beesia@kas',
      title: 'Aihe B',
      description: 'Joku hyvä kuvaus',
      environment: 'Joku hyvä toteutusympäristö',
      customerName: 'Beesiakas',
      additionalInfo: 'Joku hyvä lisätieto',
      specialRequests: 'Joku hyvä erityistoive'
    }),
    secret_id: 'Coh5boozeyish7iS',
    configuration_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }
]

module.exports = {
  up: async (query) => {
    await query.bulkInsert('topics', additionalTopic, {})
  },

  down: async (query) => {
    await query.bulkDelete('topics', { secret_id: 'Coh5boozeyish7iS' }, {})
  }
}
