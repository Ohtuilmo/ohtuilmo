import PropTypes from 'prop-types'

export const registrationQuestionShape = PropTypes.shape({
  question: PropTypes.string.isRequired,
  type: PropTypes.string
})

export const registrationQuestionSetShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  questions: PropTypes.arrayOf(registrationQuestionShape),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
})

export const peerReviewQuestionShape = PropTypes.shape({
  header: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string)
})

export const peerReviewQuestionSetShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  questions: PropTypes.arrayOf(peerReviewQuestionShape),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
})
