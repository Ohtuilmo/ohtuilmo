'use strict'

// This topic is only for the topic list page active toggle tests,
// don't rely on this topic's active state anywhere!

const topics = [
  {
    active: true,
    acronym: '',
    content: JSON.stringify({
      email: 'ceesia@kas',
      title: 'Aihe C',
      description:
        'Olipa kerran kolmenkymmenen merkkirajan sääntö. Devaaja kirjotteli liirum laarumia jotta softa ei poksu.',
      environment:
        'Tykitelkääs nodejäsää ja reaktii, saadaa rahotus pöhinän mukaan. Plus kolkyt merkkiä.',
      customerName: 'Ceesiakas',
      additionalInfo: 'Joku hyvä lisätieto',
      specialRequests: 'Joku hyvä erityistoive'
    }),
    secret_id: 'Doh5boozeyish7iV',
    configuration_id: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

module.exports = {
  up: async (query) => {
    await query.bulkInsert('topics', topics, {})
  },

  down: async (query) => {
    await query.bulkDelete('topics', { secret_id: 'Doh5boozeyish7iV' }, {})
  }
}
