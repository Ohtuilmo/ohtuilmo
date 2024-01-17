import registrationQuestionsService from '../../services/registrationQuestionSet'

const fetchRegistrationQuestionSetsSuccess = (questionSets) => ({
  type: 'FETCH_REGISTRATION_QUESTION_SETS_SUCCESS',
  payload: questionSets
})

const createRegistrationQuestionSetSuccess = (createdSet) => ({
  type: 'CREATE_REGISTRATION_QUESTION_SET_SUCCESS',
  payload: createdSet
})

const updateRegistrationQuestionSetSuccess = (updatedSet) => ({
  type: 'UPDATE_REGISTRATION_QUESTION_SET_SUCCESS',
  payload: updatedSet
})

/**
 * @throws if service can't fetch questions, catch this error.
 */
export const fetchRegistrationQuestionSets = () => {
  return async (dispatch) => {
    const questionSets = await registrationQuestionsService.getAll()
    dispatch(fetchRegistrationQuestionSetsSuccess(questionSets))
  }
}

export const createRegistrationQuestionSet = (name, questions) => {
  return async (dispatch) => {
    const createdSet = await registrationQuestionsService.create({
      name,
      questions
    })
    dispatch(createRegistrationQuestionSetSuccess(createdSet))
  }
}

export const updateRegistrationQuestionSet = (questionSet) => {
  return async (dispatch) => {
    const updatedSet = await registrationQuestionsService.update(questionSet)
    dispatch(updateRegistrationQuestionSetSuccess(updatedSet))
  }
}
