import peerReviewQuestionsService from '../../services/peerReviewQuestionSet'

const fetchPeerReviewQuestionSetsSuccess = (questionSets) => ({
  type: 'FETCH_PEER_REVIEW_QUESTION_SETS_SUCCESS',
  payload: questionSets
})

const createPeerReviewQuestionSetSuccess = (createdSet) => ({
  type: 'CREATE_PEER_REVIEW_QUESTION_SET_SUCCESS',
  payload: createdSet
})

const updatePeerReviewQuestionSetSuccess = (updatedSet) => ({
  type: 'UPDATE_PEER_REVIEW_QUESTION_SET_SUCCESS',
  payload: updatedSet
})

/**
 * @throws if service can't fetch questions, catch this error.
 */
export const fetchPeerReviewQuestionSets = () => {
  return async (dispatch) => {
    const questionSets = await peerReviewQuestionsService.getAll()
    dispatch(fetchPeerReviewQuestionSetsSuccess(questionSets))
  }
}

export const createPeerReviewQuestionSet = (name, questions) => {
  return async (dispatch) => {
    const createdSet = await peerReviewQuestionsService.create({
      name,
      questions
    })
    dispatch(createPeerReviewQuestionSetSuccess(createdSet))
  }
}

export const updatePeerReviewQuestionSet = (questionSet) => {
  return async (dispatch) => {
    const updatedSet = await peerReviewQuestionsService.update(questionSet)
    dispatch(updatePeerReviewQuestionSetSuccess(updatedSet))
  }
}
