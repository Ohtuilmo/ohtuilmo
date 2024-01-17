import customerReviewQuestionsService from '../../services/customerReviewQuestionSet'

const fetchCustomerReviewQuestionSetsSuccess = (questionSets) => ({
  type: 'FETCH_CUSTOMER_REVIEW_QUESTION_SETS_SUCCESS',
  payload: questionSets
})

const createCustomerReviewQuestionSetSuccess = (createdSet) => ({
  type: 'CREATE_CUSTOMER_REVIEW_QUESTION_SET_SUCCESS',
  payload: createdSet
})

const updateCustomerReviewQuestionSetSuccess = (updatedSet) => ({
  type: 'UPDATE_CUSTOMER_REVIEW_QUESTION_SET_SUCCESS',
  payload: updatedSet
})

/**
 * @throws if service can't fetch questions, catch this error.
 */
export const fetchCustomerReviewQuestionSets = () => {
  return async (dispatch) => {
    const questionSets = await customerReviewQuestionsService.getAll()
    dispatch(fetchCustomerReviewQuestionSetsSuccess(questionSets))
  }
}

export const createCustomerReviewQuestionSet = (name, questions) => {
  return async (dispatch) => {
    const createdSet = await customerReviewQuestionsService.create({
      name,
      questions
    })
    dispatch(createCustomerReviewQuestionSetSuccess(createdSet))
  }
}

export const updateCustomerReviewQuestionSet = (questionSet) => {
  return async (dispatch) => {
    const updatedSet = await customerReviewQuestionsService.update(questionSet)
    dispatch(updateCustomerReviewQuestionSetSuccess(updatedSet))
  }
}
