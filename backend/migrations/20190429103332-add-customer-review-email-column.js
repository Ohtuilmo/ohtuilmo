'use strict'

module.exports = {
  up: async (query, Sequelize) => {
    await query.addColumn(
      'email_templates',
      'customer_review_link_fin',
      Sequelize.TEXT
    )
    await query.addColumn(
      'email_templates',
      'customer_review_link_eng',
      Sequelize.TEXT
    )

    // instead of leaving these new templates null, set them to '' which is what
    // the API would do
    await query.bulkUpdate(
      'email_templates',
      {
        customer_review_link_fin: ''
      },
      { customer_review_link_fin: null }
    )
    await query.bulkUpdate(
      'email_templates',
      {
        customer_review_link_eng: ''
      },
      { customer_review_link_eng: null }
    )
  },

  down: async (query) => {
    await query.removeColumn('email_templates', 'customer_review_link_eng')
    await query.removeColumn('email_templates', 'customer_review_link_fin')
  }
}
