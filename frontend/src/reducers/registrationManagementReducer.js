const initialState = {
  registrationManagementFetched: false,
  peerReviewConf: 0,
  peerReviewOpen: false,
  peerReviewRound: 1,
  projectRegistrationConf: 0,
  projectRegistrationOpen: false,
  projectRegistrationMessage: 'Registration is closed.',
  projectRegistrationInfo: '',
  topicRegistrationConf: 0,
  topicRegistrationOpen: false,
  topicRegistrationMessage: 'Registration is closed.'
}

const registrationManagementReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_REGISTRATION_MANAGEMENT':
    return {
      registrationManagementFetched: true,
      peerReviewConf: action.payload.peerReviewConf,
      peerReviewOpen: action.payload.peerReviewOpen,
      peerReviewRound: action.payload.peerReviewRound,
      projectRegistrationConf: action.payload.projectRegistrationConf,
      projectRegistrationOpen: action.payload.projectRegistrationOpen,
      projectRegistrationMessage: action.payload.projectRegistrationMessage,
      projectRegistrationInfo: action.payload.projectRegistrationInfo,
      topicRegistrationConf: action.payload.topicRegistrationConf,
      topicRegistrationOpen: action.payload.topicRegistrationOpen,
      topicRegistrationMessage: action.payload.topicRegistrationMessage
    }
  case 'UPDATE_PEER_REVIEW_CONF':
    return {
      ...state,
      peerReviewConf: action.payload
    }
  case 'UPDATE_PEER_REVIEW_OPEN':
    return {
      ...state,
      peerReviewOpen: action.payload
    }
  case 'UPDATE_PEER_REVIEW_ROUND':
    return {
      ...state,
      peerReviewRound: action.payload
    }
  case 'UPDATE_PROJECT_REGISTRATION_CONF':
    return {
      ...state,
      projectRegistrationConf: action.payload
    }
  case 'UPDATE_PROJECT_REGISTRATION_OPEN':
    return {
      ...state,
      projectRegistrationOpen: action.payload
    }
  case 'UPDATE_PROJECT_REGISTRATION_MESSAGE':
    return {
      ...state,
      projectRegistrationMessage: action.payload
    }
  case 'UPDATE_PROJECT_REGISTRATION_INFO':
    return {
      ...state,
      projectRegistrationInfo: action.payload
    }
  case 'UPDATE_TOPIC_REGISTRATION_CONF':
    return {
      ...state,
      topicRegistrationConf: action.payload
    }
  case 'UPDATE_TOPIC_REGISTRATION_OPEN':
    return {
      ...state,
      topicRegistrationOpen: action.payload
    }
  case 'UPDATE_TOPIC_REGISTRATION_MESSAGE':
    return {
      ...state,
      topicRegistrationMessage: action.payload
    }
  default:
    return state
  }
}

export default registrationManagementReducer
