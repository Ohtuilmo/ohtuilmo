import { combineReducers } from 'redux'

const filter = (state = 0, action) => {
  switch (action.type) {
  case 'TOPIC_PAGE_UPDATE_FILTER':
    return action.payload
  default:
    return state
  }
}

const isTopicsLoading = (state = false, action) => {
  switch (action.type) {
  case 'TOPIC_PAGE_FETCH_TOPICS_REQUEST':
    return true
  case 'TOPIC_PAGE_FETCH_TOPICS_SUCCESS':
  case 'TOPIC_PAGE_FETCH_TOPICS_FAILED':
    return false
  default:
    return state
  }
}

const updateTopic = (topics, updatedTopic) =>
  topics.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic))

const addSentEmail = (topic, newSentEmail) => ({
  ...topic,
  sentEmails: [...topic.sentEmails, newSentEmail]
})

const topics = (state = [], action) => {
  switch (action.type) {
  case 'TOPIC_PAGE_FETCH_TOPICS_SUCCESS':
    return action.payload
  case 'TOPIC_PAGE_UPDATE_TOPIC_SUCCESS':
    return updateTopic(state, action.payload)
  case 'TOPIC_PAGE_TOPIC_ADD_SENT_EMAIL': {
    const { topicId, sentEmail } = action.payload
    return state.map((topic) =>
      topic.id === topicId ? addSentEmail(topic, sentEmail) : topic
    )
  }
  default:
    return state
  }
}

export default combineReducers({
  filter,
  topics,
  isTopicsLoading
})
