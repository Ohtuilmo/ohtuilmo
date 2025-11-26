'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'configurations', // name of the Source model
      'active', // name of the key we're adding
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    )
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('configurations', 'active')
  }
}
