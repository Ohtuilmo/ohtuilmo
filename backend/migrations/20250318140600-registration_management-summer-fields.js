'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.addColumn(
      'registration_managements',
      'summer_project',
      Sequelize.BOOLEAN
    )
    await query.addColumn(
      'registration_managements',
      'summer_dates',
      Sequelize.JSONB
    )
  },

  down: async (query) => {
    await query.removeColumn(
      'registration_managements',
      'summer_project'
    )
    await query.removeColumn(
      'registration_managements',
      'summer_dates'
    )
  }
}
