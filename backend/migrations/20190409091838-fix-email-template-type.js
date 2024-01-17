'use strict'

// The data type for "email_templates" was mistakenly set to STRING instead of
// TEXT in the create-email-template migration. This would limit the template
// length to 255 characters.

const columns = [
  'topic_accepted_fin',
  'topic_rejected_fin',
  'topic_accepted_eng',
  'topic_rejected_eng'
]
const tableName = 'email_templates'

module.exports = {
  up: (query, Sequelize) => {
    const promises = columns.map((columnName) =>
      query.changeColumn(tableName, columnName, {
        type: Sequelize.TEXT
      })
    )

    return Promise.all(promises)
  },

  down: (query, Sequelize) => {
    const promises = columns.map((columnName) =>
      query.changeColumn(tableName, columnName, {
        type: Sequelize.STRING
      })
    )

    return Promise.all(promises)
  }
}
