const randomstring = require('randomstring')

export type MessageType = "topicAccepted" | 'topicRejected' | 'customerReviewLink'
export type MessageLanguage = 'finnish' | 'english'
export type TemplateName = 'topic_accepted_fin' | 'topic_accepted_eng' | 'topic_rejected_fin' | 'topic_rejected_eng' | 'customer_review_link_fin' | 'customer_review_link_eng'


const msgTypeToDbColumn: Record<string, Record<string, TemplateName>> = {
  topicAccepted: {
    finnish: 'topic_accepted_fin',
    english: 'topic_accepted_eng',
  },
  topicRejected: {
    finnish: 'topic_rejected_fin',
    english: 'topic_rejected_eng',
  },
  customerReviewLink: {
    finnish: 'customer_review_link_fin',
    english: 'customer_review_link_eng',
  },
}

/**
 * @type {{[key: string]: {type: MessageType, language: MessageLanguage}}}
 */
const dbColumnToMsgType: Record<string, { type: MessageType, language: MessageLanguage }> = {
  topic_accepted_fin: { type: 'topicAccepted', language: 'finnish' },
  topic_accepted_eng: { type: 'topicAccepted', language: 'english' },
  topic_rejected_fin: { type: 'topicRejected', language: 'finnish' },
  topic_rejected_eng: { type: 'topicRejected', language: 'english' },
  customer_review_link_fin: { type: 'customerReviewLink', language: 'finnish' },
  customer_review_link_eng: { type: 'customerReviewLink', language: 'english' },
}

export const emailTypeToTemplateName = (messageType: MessageType, messageLanguage: MessageLanguage): TemplateName =>
  msgTypeToDbColumn[messageType][messageLanguage]

export const templateNameToEmailType = (templateName: TemplateName): { type: MessageType, language: MessageLanguage } =>
  dbColumnToMsgType[templateName]

/**
 * reverse(uppercase(trim(str)))
 *   is same as  ↓
 * pipe(trim, uppercase, reverse)(str)
 */
export const pipe =
  (...fns: any[]) =>
    (value: any) =>
      fns.reduce((v, fn) => fn(v), value)

export const getRandomId = () => {
  return 'a' + randomstring.generate(16)
}

export const isDevelopmentEnvironment = () => process.env.NODE_ENV === 'development'
export const isProductionEnvironment = () => process.env.NODE_ENV === 'production'

export default {
  emailTypeToTemplateName,
  templateNameToEmailType,
  pipe,
  getRandomId,
  isDevelopmentEnvironment,
  isProductionEnvironment,
}
