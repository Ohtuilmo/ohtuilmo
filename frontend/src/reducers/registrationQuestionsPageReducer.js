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
  case 'FETCH_REGISTRATION_QUESTION_SETS_SUCCESS':
    return action.payload
  case 'CREATE_REGISTRATION_QUESTION_SET_SUCCESS':
    return createQuestionSet(state, action.payload)
  case 'UPDATE_REGISTRATION_QUESTION_SET_SUCCESS':
    return updateQuestionSet(state, action.payload)
  default:
    return state
  }
}

const registrationQuestionsPageReducer = combineReducers({
  questionSets,
})

export default registrationQuestionsPageReducer
