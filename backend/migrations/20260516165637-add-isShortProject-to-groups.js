'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'groups',
      'is_short_project',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    )
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('groups', 'is_short_project')
  }
}
