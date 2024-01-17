'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.dropTable('peer_review')
    await query.dropTable('peer_reviews')

    await query.createTable('peer_reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.STRING
      },
      configuration_id: {
        type: Sequelize.INTEGER
      },
      review_round: {
        type: Sequelize.INTEGER
      },
      answer_sheet: {
        type: Sequelize.JSONB
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

    // peer_reviews.user <-> users.student_number
    await query.addConstraint('peer_reviews', ['user_id'], {
      name: 'peer_reviews_user_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'users',
        field: 'student_number'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    // peer_reviews.configuration <-> configuration.id
    await query.addConstraint('peer_reviews', ['configuration_id'], {
      name: 'peer_reviews_configuration_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'configurations',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  down: async (query) => {
    await query.removeConstraint('peer_reviews', 'peer_reviews_user_fkey')
    await query.removeConstraint(
      'peer_reviews',
      'peer_reviews_configuration_fkey'
    )
    await query.dropTable('peer_reviews')
  }
}
