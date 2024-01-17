import registrationManagementService from '../../services/registrationManagement'

const fetchRegistrationManagement = () => {
  return async (dispatch) => {
    const response = await registrationManagementService.get()
    const {
      peer_review_conf,
      peer_review_open,
      peer_review_round,
      project_registration_conf,
      project_registration_open,
      project_registration_message,
      project_registration_info,
      topic_registration_conf,
      topic_registration_open,
      topic_registration_message
    } = response.registrationManagement

    dispatch({
      type: 'SET_REGISTRATION_MANAGEMENT',
      payload: {
        peerReviewConf: peer_review_conf,
        peerReviewOpen: peer_review_open,
        peerReviewRound: peer_review_round,
        projectRegistrationConf: project_registration_conf,
        projectRegistrationOpen: project_registration_open,
        projectRegistrationMessage: project_registration_message,
        projectRegistrationInfo: project_registration_info,
        topicRegistrationConf: topic_registration_conf,
        topicRegistrationOpen: topic_registration_open,
        topicRegistrationMessage: topic_registration_message
      }
    })
  }
}

const updatePeerReviewConf = (peerReviewConf) => {
  return {
    type: 'UPDATE_PEER_REVIEW_CONF',
    payload: peerReviewConf
  }
}

const updatePeerReviewOpen = (peerReviewOpen) => {
  return {
    type: 'UPDATE_PEER_REVIEW_OPEN',
    payload: peerReviewOpen
  }
}

const updatePeerReviewRound = (peerReviewRound) => {
  return {
    type: 'UPDATE_PEER_REVIEW_ROUND',
    payload: peerReviewRound
  }
}

const updateProjectRegistrationConf = (projectRegistrationConf) => {
  return {
    type: 'UPDATE_PROJECT_REGISTRATION_CONF',
    payload: projectRegistrationConf
  }
}

const updateProjectRegistrationOpen = (projectRegistrationOpen) => {
  return {
    type: 'UPDATE_PROJECT_REGISTRATION_OPEN',
    payload: projectRegistrationOpen
  }
}

const updateProjectRegistrationMessage = (projectRegistrationMessage) => {
  return {
    type: 'UPDATE_PROJECT_REGISTRATION_MESSAGE',
    payload: projectRegistrationMessage
  }
}

const updateProjectRegistrationInfo = (projectRegistrationInfo) => {
  return {
    type: 'UPDATE_PROJECT_REGISTRATION_INFO',
    payload: projectRegistrationInfo
  }
}

const updateTopicRegistrationConf = (topicRegistrationConf) => {
  return {
    type: 'UPDATE_TOPIC_REGISTRATION_CONF',
    payload: topicRegistrationConf
  }
}

const updateTopicRegistrationOpen = (topicRegistrationOpen) => {
  return {
    type: 'UPDATE_TOPIC_REGISTRATION_OPEN',
    payload: topicRegistrationOpen
  }
}

const updateTopicRegistrationMessage = (topicRegistrationMessage) => {
  return {
    type: 'UPDATE_TOPIC_REGISTRATION_MESSAGE',
    payload: topicRegistrationMessage
  }
}

export default {
  updatePeerReviewConf,
  fetchRegistrationManagement,
  updatePeerReviewOpen,
  updatePeerReviewRound,
  updateProjectRegistrationConf,
  updateProjectRegistrationOpen,
  updateProjectRegistrationMessage,
  updateProjectRegistrationInfo,
  updateTopicRegistrationConf,
  updateTopicRegistrationOpen,
  updateTopicRegistrationMessage
}
