/**
 * This migration adds a new column named 'project_registration_info'
 * to table 'registration message'. This will make it possible to set additional
 * information message about SE project to be shown on page '/register'
 */

'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.addColumn(
      'registration_managements',
      'project_registration_info',
      Sequelize.STRING
    )
  },

  down: async (query) => {
    await query.removeColumn(
      'registration_managements',
      'project_registration_info'
    )
  }
}
