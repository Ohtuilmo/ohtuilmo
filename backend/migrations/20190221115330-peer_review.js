'use strict'

module.exports = {
  up: (query, Sequelize) => {
    return query.createTable('peer_review', {
      user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncerment: false,
        allowNull: false,
      },
      configuration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      answer_sheet: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      // Sequelize timestamps
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: (query) => {
    return query.dropTable('peer_review')
  },
}
