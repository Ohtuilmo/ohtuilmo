import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

import {
  fetchCustomerReviewQuestionSets,
  updateCustomerReviewQuestionSet
} from '../../reducers/actions/customerReviewQuestionsPageActions'
import {
  setError,
  setSuccess
} from '../../reducers/actions/notificationActions'

import { peerReviewQuestionSetShape } from '../common/sharedPropTypes'
import CustomerReviewQuestionSetList from './CustomerReviewQuestionSetList'
import CreateCustomerReviewQuestionSet from './CreateCustomerReviewQuestionSet'
import './CustomerReviewQuestionsPage.css'

const isValidationError = (e) => e.response && e.response.status === 400

class CustomerReviewQuestionsPage extends React.Component {
  async componentDidMount() {
    try {
      await this.props.fetchCustomerReviewQuestionSets()
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
      await this.props.updateCustomerReviewQuestionSet(updatedQuestionSet)
      this.handleSuccess(`Updated question set "${updatedQuestionSet.name}"!`)
    } catch (err) {
      this.handleError(err)
    }
  }

  render() {
    const { questionSets } = this.props

    return (
      <div className="customer-review-questions-page">
        <h1>Configure customer review questions</h1>
        <div className="customer-review-questions-page__container">
          <section style={{ marginBottom: '2rem' }}>
            <h2>Create question set</h2>
            <Paper
              depth={1}
              className="customer-review-questions-page__create-form"
            >
              <CreateCustomerReviewQuestionSet />
            </Paper>
          </section>
          <section>
            <h2>Question sets</h2>
            <CustomerReviewQuestionSetList
              questionSets={questionSets}
              onQuestionSetUpdate={this.handleQuestionSetUpdate}
            />
          </section>
        </div>
      </div>
    )
  }
}

CustomerReviewQuestionsPage.propTypes = {
  questionSets: PropTypes.arrayOf(peerReviewQuestionSetShape),
  history: PropTypes.any,
  setError: PropTypes.func,
  setSuccess: PropTypes.func,
  fetchCustomerReviewQuestionSets: PropTypes.func,
  updateCustomerReviewQuestionSet: PropTypes.func
}

const mapStateToProps = (state) => ({
  questionSets: state.customerReviewQuestionsPage.questionSets
})

const mapDispatchToProps = {
  fetchCustomerReviewQuestionSets,
  updateCustomerReviewQuestionSet,
  setError,
  setSuccess
}

const ConnectedCustomerReviewQuestionsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerReviewQuestionsPage)

export default withRouter(ConnectedCustomerReviewQuestionsPage)
