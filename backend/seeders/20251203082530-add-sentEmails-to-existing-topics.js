'use strict'
const { Op } = require('sequelize')

const sentEmails = [
  {
    email_template_name: 'topic_accepted_fin',
    created_at: new Date(),
    updated_at: new Date(),
    topic_id: 1
  },
  {
    email_template_name: 'topic_accepted_eng',
    created_at: new Date(),
    updated_at: new Date(),
    topic_id: 1
  },
  {
    email_template_name: 'topic_accepted_fin',
    created_at: new Date(),
    updated_at: new Date(),
    topic_id: 2
  },
]

module.exports = {
  up: async (query) => {
    await query.bulkInsert('sent_topic_emails', sentEmails, {})
  },

  down: async (query) => {
    await query.bulkDelete('sent_topic_emails', { [Op.or]: [{ topic_id: 1 }, { topic_id: 2 }] }, {})
  }
}
