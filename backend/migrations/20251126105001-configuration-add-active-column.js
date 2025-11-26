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
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn('configurations', 'active')
  }
}
