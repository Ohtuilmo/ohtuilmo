'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.addColumn(
      'registration_managements',
      'peer_review_open',
      Sequelize.BOOLEAN
    )
    await query.addColumn(
      'registration_managements',
      'peer_review_round',
      Sequelize.INTEGER
    )
  },

  down: async (query) => {
    await query.removeColumn('registration_managements', 'peer_review_open')
    await query.removeColumn('registration_managements', 'peer_review_round')
  }
}
