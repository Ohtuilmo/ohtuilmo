import topicService from '../../services/topic'
import emailService from '../../services/email'

const updateFilter = (filter) => {
  return {
    type: 'TOPIC_PAGE_UPDATE_FILTER',
    payload: filter
  }
}

const fetchTopicsRequest = () => ({
  type: 'TOPIC_PAGE_FETCH_TOPICS_REQUEST'
})

const fetchTopicsFailed = () => ({
  type: 'TOPIC_PAGE_FETCH_TOPICS_FAILED'
})

const fetchTopicsSuccess = (topics) => ({
  type: 'TOPIC_PAGE_FETCH_TOPICS_SUCCESS',
  payload: topics
})

const updateTopicSuccess = (updatedTopic) => ({
  type: 'TOPIC_PAGE_UPDATE_TOPIC_SUCCESS',
  payload: updatedTopic
})

const updateSentEmail = (topicId, sentEmail) => ({
  type: 'TOPIC_PAGE_TOPIC_ADD_SENT_EMAIL',
  payload: {
    topicId,
    sentEmail
  }
})

const fetchTopics = () => {
  return async (dispatch) => {
    dispatch(fetchTopicsRequest())
    try {
      const topics = await topicService.getAll()
      //sorts topics based on timestamp
      const sortedTopics = topics.sort((t1, t2) =>
        t1.createdAt > t2.createdAt ? -1 : t1.createdAt < t2.createdAt ? 1 : 0
      )
      dispatch(fetchTopicsSuccess(sortedTopics))
    } catch (e) {
      dispatch(fetchTopicsFailed())
      throw e // re-throw so UI can catch for error msg
    }
  }
}

/**
 * @param {string} topicId
 * @param {boolean} newActiveState
 */
const setTopicActive = (topic, newActiveState) => {
  return async (dispatch) => {
    const stagedTopic = {
      ...topic,
      active: newActiveState
    }
    // don't catch error so UI can catch it and display proper error msg
    const updatedTopic = await topicService.update(stagedTopic)
    dispatch(
      updateTopicSuccess({
        ...updatedTopic,
        // Copy over the hasReviewed and sentEmails fields since the PUT
        // doesn't provide these computed values.
        hasReviewed: topic.hasReviewed,
        sentEmails: topic.sentEmails
      })
    )
  }
}

const sendCustomerEmail = (topicId, messageType, messageLanguage) => {
  return async (dispatch) => {
    const createdMail = await emailService.sendCustomerEmail({
      messageType,
      messageLanguage,
      topicId
    })
    dispatch(updateSentEmail(topicId, createdMail))
  }
}

export default {
  fetchTopics,
  setTopicActive,
  updateFilter,
  sendCustomerEmail
}
