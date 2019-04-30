import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

import {
  fetchRegistrationQuestionSets,
  updateRegistrationQuestionSet
} from '../../reducers/actions/registrationQuestionsPageActions'
import {
  setError,
  setSuccess
} from '../../reducers/actions/notificationActions'

import { registrationQuestionSetShape } from '../common/sharedPropTypes'
import CreateRegistrationQuestionSet from './CreateRegistrationQuestionSet'
import RegistrationQuestionSetList from './RegistrationQuestionSetList'
import './RegistrationQuestionsPage.css'

const isValidationError = (e) => e.response && e.response.status === 400

class RegistrationQuestionsPage extends React.Component {
  async componentDidMount() {
    try {
      await this.props.fetchRegistrationQuestionSets()
    } catch (err) {
      this.handleError(err)
    }
  }

  handleError = (e) => {
    const { setError } = this.props

    console.error('error happened', e, e.response)
    if (isValidationError(e)) {
      // was error 400, server should have responded { "error": "..." }
      setError(`An error occurred: "${e.response.data.error}"!`, 5000)
    } else {
      setError('Some error happened', 3000)
    }
  }

  handleSuccess = (message) => {
    this.props.setSuccess(message, 3000)
  }

  handleQuestionSetUpdate = async (updatedQuestionSet) => {
    try {
      await this.props.updateRegistrationQuestionSet(updatedQuestionSet)
      this.handleSuccess(`Updated question set "${updatedQuestionSet.name}"!`)
    } catch (err) {
      this.handleError(err)
    }
  }

  render() {
    const { questionSets } = this.props

    return (
      <div className="registration-questions-page">
        <h1>Configure registration questions</h1>
        <div className="registration-questions-page__container">
          <section style={{ marginBottom: '2rem' }}>
            <h2>Create question set</h2>
            <Paper
              depth={1}
              className="registration-questions-page__create-form"
            >
              <CreateRegistrationQuestionSet />
            </Paper>
          </section>
          <section>
            <h2>Question sets</h2>
            <RegistrationQuestionSetList
              questionSets={questionSets}
              onQuestionSetUpdate={this.handleQuestionSetUpdate}
            />
          </section>
        </div>
      </div>
    )
  }
}

RegistrationQuestionsPage.propTypes = {
  questionSets: PropTypes.arrayOf(registrationQuestionSetShape),
  history: PropTypes.any,
  setError: PropTypes.func,
  setSuccess: PropTypes.func,
  fetchRegistrationQuestionSets: PropTypes.func,
  updateRegistrationQuestionSet: PropTypes.func
}

const mapStateToProps = (state) => ({
  questionSets: state.registrationQuestionsPage.questionSets
})

const mapDispatchToProps = {
  fetchRegistrationQuestionSets,
  updateRegistrationQuestionSet,
  setError,
  setSuccess
}

const ConnectedRegistrationQuestionsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationQuestionsPage)

export default withRouter(ConnectedRegistrationQuestionsPage)
