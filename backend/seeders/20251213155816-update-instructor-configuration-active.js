'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkUpdate(
      'configurations',
      { name: 'Konfiguraatio 1' },
      { active: true }
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkUpdate(
      'configurations',
      { name: 'Konfiguraatio 1' },
      { active: false }
    )
  }
}
