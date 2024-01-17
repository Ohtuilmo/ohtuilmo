import { combineReducers } from 'redux'

const createQuestionSet = (state, newSet) => [...state, newSet]
const updateQuestionSet = (state, updatedSet) => {
  const oldQuestionSet = state.find((_) => _.id === updatedSet.id)
  if (!oldQuestionSet) {
    return createQuestionSet(state, updatedSet)
  }

  return state.map((_) => (_.id === updatedSet.id ? updatedSet : _))
}

const questionSets = (state = [], action) => {
  switch (action.type) {
  case 'FETCH_PEER_REVIEW_QUESTION_SETS_SUCCESS':
    return action.payload
  case 'CREATE_PEER_REVIEW_QUESTION_SET_SUCCESS':
    return createQuestionSet(state, action.payload)
  case 'UPDATE_PEER_REVIEW_QUESTION_SET_SUCCESS':
    return updateQuestionSet(state, action.payload)
  default:
    return state
  }
}

const peerReviewQuestionsPageReducer = combineReducers({
  questionSets
})

export default peerReviewQuestionsPageReducer
