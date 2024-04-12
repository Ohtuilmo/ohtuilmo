import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

import {
  fetchPeerReviewQuestionSets,
  updatePeerReviewQuestionSet
} from '../../reducers/actions/peerReviewQuestionsPageActions'
import {
  setError,
  setSuccess
} from '../../reducers/actions/notificationActions'

import { peerReviewQuestionSetShape } from '../common/sharedPropTypes'
import PeerReviewQuestionSetList from './PeerReviewQuestionSetList'
import CreatePeerReviewQuestionSet from './CreatePeerReviewQuestionSet'
import './PeerReviewQuestionsPage.css'

const isValidationError = (e) => e.response && e.response.status === 400

class PeerReviewQuestionsPage extends React.Component {
  async componentDidMount() {
    try {
      await this.props.fetchPeerReviewQuestionSets()
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
      await this.props.updatePeerReviewQuestionSet(updatedQuestionSet)
      this.handleSuccess(`Updated question set "${updatedQuestionSet.name}"!`)
    } catch (err) {
      this.handleError(err)
    }
  }

  render() {
    const { questionSets } = this.props

    return (
      <div className="peer-review-questions-page">
        <h1>Configure peer review questions</h1>
        <div className="peer-review-questions-page__container">
          <section style={{ marginBottom: '2rem' }}>
            <h2>Create question set</h2>
            <Paper
              depth={1}
              className="peer-review-questions-page__create-form"
            >
              <CreatePeerReviewQuestionSet />
            </Paper>
          </section>
          <section>
            <h2>Question sets</h2>
            <PeerReviewQuestionSetList
              questionSets={questionSets}
              onQuestionSetUpdate={this.handleQuestionSetUpdate}
            />
          </section>
        </div>
      </div>
    )
  }
}

PeerReviewQuestionsPage.propTypes = {
  questionSets: PropTypes.arrayOf(peerReviewQuestionSetShape),
  history: PropTypes.any,
  setError: PropTypes.func,
  setSuccess: PropTypes.func,
  fetchPeerReviewQuestionSets: PropTypes.func,
  updatePeerReviewQuestionSet: PropTypes.func
}

const mapStateToProps = (state) => ({
  questionSets: state.peerReviewQuestionsPage.questionSets
})

const mapDispatchToProps = {
  fetchPeerReviewQuestionSets,
  updatePeerReviewQuestionSet,
  setError,
  setSuccess
}

const ConnectedPeerReviewQuestionsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerReviewQuestionsPage)

export default withRouter(ConnectedPeerReviewQuestionsPage)
