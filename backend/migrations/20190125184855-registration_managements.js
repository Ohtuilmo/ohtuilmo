'use strict'

module.exports = {
  up: (query, Sequelize) => {
    return query.createTable('registration_managements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      project_registration_open: {
        type: Sequelize.BOOLEAN
      },
      project_registration_message: {
        type: Sequelize.STRING
      },
      topic_registration_open: {
        type: Sequelize.BOOLEAN
      },
      topic_registration_message: {
        type: Sequelize.STRING
      },
      // Sequelize timestamps
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: (query) => {
    return query.dropTable('registration_managements')
  }
}
