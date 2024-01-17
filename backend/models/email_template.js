'use strict'
const { pipe } = require('../utils')
const { urls } = require('../config')

const replaceTopicName = (name) => (template) =>
  template.replace(/{{topicName}}/g, name)

const replaceSecretLink = (link) => (template) =>
  template.replace(/{{secretLink}}/g, link)

module.exports = (sequelize, Sequelize) => {
  const EmailTemplate = sequelize.define(
    'email_templates',
    {
      topic_accepted_fin: Sequelize.TEXT,
      topic_rejected_fin: Sequelize.TEXT,
      topic_accepted_eng: Sequelize.TEXT,
      topic_rejected_eng: Sequelize.TEXT,
      customer_review_link_fin: Sequelize.TEXT,
      customer_review_link_eng: Sequelize.TEXT
    },
    {
      underscored: true
    }
  )

  const isCustomerReviewLinkTemplate = (str) =>
    str === 'customer_review_link_fin' || str === 'customer_review_link_eng'

  EmailTemplate.prototype.render = function render(templateName, context) {
    const { topic } = context
    const template = this.getDataValue(templateName)

    const operations = [replaceTopicName(topic.content.title)]

    if (isCustomerReviewLinkTemplate(templateName)) {
      const link = urls.forCustomerReviewLink(topic.secret_id)
      operations.push(replaceSecretLink(link))
    }

    return pipe(...operations)(template)
  }

  return EmailTemplate
}
