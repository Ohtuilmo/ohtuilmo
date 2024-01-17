'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER })
    */

    await query.createTable('customer_review_question_sets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      questions: {
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

    await query.createTable('customer_reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      },
      // foreign keys
      group_id: {
        type: Sequelize.INTEGER
      },
      topic_id: {
        type: Sequelize.INTEGER
      },
      configuration_id: {
        type: Sequelize.INTEGER
      }
    })

    await query.addColumn(
      'configurations',
      'customer_review_question_set_id',
      Sequelize.INTEGER
    )

    await query.addConstraint('customer_reviews', ['group_id'], {
      name: 'customer_reviews_group_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'groups',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await query.addConstraint('customer_reviews', ['topic_id'], {
      name: 'customer_reviews_topic_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'topics',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await query.addConstraint('customer_reviews', ['configuration_id'], {
      name: 'customer_reviews_configuration_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'configurations',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })

    await query.addConstraint(
      'configurations',
      ['customer_review_question_set_id'],
      {
        name: 'configurations_customer_review_question_set_id_fkey',
        type: 'FOREIGN KEY',
        references: {
          table: 'customer_review_question_sets',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    )
  },

  down: async (query) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users')
    */
    await query.removeConstraint(
      'configurations',
      'configurations_customer_review_question_set_id_fkey'
    )

    await query.removeColumn(
      'configurations',
      'customer_review_question_set_id'
    )

    await query.removeConstraint(
      'customer_reviews',
      'customer_reviews_configuration_fkey'
    )
    await query.removeConstraint(
      'customer_reviews',
      'customer_reviews_group_fkey'
    )
    await query.removeConstraint(
      'customer_reviews',
      'customer_reviews_topic_fkey'
    )

    await query.dropTable('customer_review_question_sets')
    await query.dropTable('customer_review')
  }
}
