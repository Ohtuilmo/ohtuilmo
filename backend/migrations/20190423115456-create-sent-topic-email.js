'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.createTable('sent_topic_emails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email_template_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      topic_id: {
        type: Sequelize.INTEGER
      }
    })
    await query.addConstraint('sent_topic_emails', ['topic_id'], {
      name: 'sent_topic_emails_topic_id_fkey',
      type: 'FOREIGN KEY',
      references: {
        table: 'topics',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },
  down: async (query) => {
    await query.removeConstraint(
      'sent_topic_emails',
      'sent_topic_emails_topic_id_fkey'
    )
    await query.dropTable('sent_topic_emails')
  }
}
