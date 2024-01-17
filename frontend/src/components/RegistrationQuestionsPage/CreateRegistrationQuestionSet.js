import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { createRegistrationQuestionSet } from '../../reducers/actions/registrationQuestionsPageActions'
import {
  setError,
  setSuccess
} from '../../reducers/actions/notificationActions'
import QuestionSetForm from '../QuestionSetForm'

const isValidationError = (err) => err.response && err.response.status === 400

const CreateRegistrationQuestionSet = ({
  onCreateRequested,
  onSuccess,
  onError
}) => {
  const handleError = (err) => {
    console.error('Error while creating registration question set', err)

    if (isValidationError(err)) {
      onError(
        `An error occurred while creating question set: ${
          err.response.data.error
        }`,
        5000
      )
    } else {
      onError('Some error happened', 3000)
    }
  }

  const handleSubmit = async (name, questionsJson) => {
    try {
      await onCreateRequested(name, JSON.parse(questionsJson))
      onSuccess(`Created new registration question set "${name}"`)
    } catch (err) {
      handleError(err)
    }
  }

  const submitButton = (
    <Button type="submit" variant="contained" color="primary">
      Create
    </Button>
  )

  return <QuestionSetForm onSubmit={handleSubmit} controls={submitButton} />
}

const mapDispatchToProps = {
  onCreateRequested: createRegistrationQuestionSet,
  onSuccess: setSuccess,
  onError: setError
}

export default connect(
  null,
  mapDispatchToProps
)(CreateRegistrationQuestionSet)
