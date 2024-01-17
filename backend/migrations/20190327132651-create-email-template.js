'use strict'

module.exports = {
  up: (query, Sequelize) => {
    return query.createTable('email_templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topic_accepted_fin: {
        type: Sequelize.STRING
      },
      topic_rejected_fin: {
        type: Sequelize.STRING
      },
      topic_accepted_eng: {
        type: Sequelize.STRING
      },
      topic_rejected_eng: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (query) => {
    return query.dropTable('email_templates')
  }
}
