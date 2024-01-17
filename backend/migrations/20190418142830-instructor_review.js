'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.createTable('instructor_reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      answer_sheet: {
        type: Sequelize.JSONB,
        allowNull: false
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

    // instructor_reviews.user <-> users.student_number
    await query.addConstraint('instructor_reviews', ['user_id'], {
      name: 'instructor_reviews_user_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'users',
        field: 'student_number'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  down: async (query) => {
    await query.removeConstraint(
      'instructor_reviews',
      'instructor_reviews_user_id_fkey'
    )
    await query.dropTable('instructor_reviews')
  }
}
