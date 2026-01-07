'use strict'

const { templateNameToEmailType } = require('../utils')

// Email template name has to be one of:
// topic_accepted_fin
// topic_accepted_eng
// topic_rejected_fin
// topic_rejected_eng
// customer_review_link_fin
// customer_review_link_eng

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
