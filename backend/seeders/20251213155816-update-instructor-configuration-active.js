'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkUpdate(
      'configurations',
      { active: true },
      { name: 'Konfiguraatio 1' }
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate(
      'configurations',
      { active: false },
      { name: 'Konfiguraatio 1' }
    )
  }
}
