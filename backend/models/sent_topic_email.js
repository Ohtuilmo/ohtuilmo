'use strict'

const { templateNameToEmailType } = require('../utils')

module.exports = (sequelize, Sequelize) => {
  const SentTopicEmail = sequelize.define(
    'sent_topic_email',
    {
      email_template_name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  )

  SentTopicEmail.format = (sentEmail) => {
    const { id, email_template_name, created_at, topic_id } = sentEmail
    return {
      id,
      timestamp: created_at,
      topic_id: topic_id,
      email: templateNameToEmailType(email_template_name)
    }
  }

  return SentTopicEmail
}
