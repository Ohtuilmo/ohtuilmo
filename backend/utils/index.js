const randomstring = require('randomstring')

/**
 * @typedef {'topicAccepted' | 'topicRejected' | 'customerReviewLink'} MessageType
 * @typedef {'finnish' | 'english'} MessageLanguage
 * @typedef {'topic_accepted_fin' | 'topic_accepted_eng' | 'topic_rejected_fin' | 'topic_rejected_eng' | 'customer_review_link_fin' | 'customer_review_link_eng'} TemplateName
 */

/**
 * @type {{[key: string]: { [key: string]: TemplateName }}}
 */
const msgTypeToDbColumn = {
  topicAccepted: {
    finnish: 'topic_accepted_fin',
    english: 'topic_accepted_eng'
  },
  topicRejected: {
    finnish: 'topic_rejected_fin',
    english: 'topic_rejected_eng'
  },
  customerReviewLink: {
    finnish: 'customer_review_link_fin',
    english: 'customer_review_link_eng'
  }
}

/**
 * @type {{[key: string]: {type: MessageType, language: MessageLanguage}}}
 */
const dbColumnToMsgType = {
  topic_accepted_fin: { type: 'topicAccepted', language: 'finnish' },
  topic_accepted_eng: { type: 'topicAccepted', language: 'english' },
  topic_rejected_fin: { type: 'topicRejected', language: 'finnish' },
  topic_rejected_eng: { type: 'topicRejected', language: 'english' },
  customer_review_link_fin: { type: 'customerReviewLink', language: 'finnish' },
  customer_review_link_eng: { type: 'customerReviewLink', language: 'english' }
}

/**
 * @param {MessageType} messageType
 * @param {MessageLanguage} messageLanguage
 * @returns {TemplateName}
 */
const emailTypeToTemplateName = (messageType, messageLanguage) =>
  msgTypeToDbColumn[messageType][messageLanguage]

/**
 * @param {TemplateName} templateName
 * @returns {{type: MessageType, language: MessageLanguage}}
 */
const templateNameToEmailType = (templateName) =>
  dbColumnToMsgType[templateName]

/**
 * reverse(uppercase(trim(str)))
 *   is same as  ↓
 * pipe(trim, uppercase, reverse)(str)
 */
const pipe = (...fns) => (value) => fns.reduce((v, fn) => fn(v), value)

const getRandomId = () => {
  return 'a' + randomstring.generate(16)
}

module.exports = {
  emailTypeToTemplateName,
  templateNameToEmailType,
  pipe,
  getRandomId
}
