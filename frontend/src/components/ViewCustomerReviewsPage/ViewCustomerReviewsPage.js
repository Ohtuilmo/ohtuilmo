import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import * as notificationActions from '../../reducers/actions/notificationActions'
import configurationPageActions from '../../reducers/actions/configurationPageActions'
import viewCustomerReviewsPageActions from '../../reducers/actions/viewCustomerReviewsPageActions'

import customerReviewService from '../../services/customerReview'
import LoadingCover from './../common/LoadingCover'

import './ViewCustomerReviewsPage.css'

class ViewCustomerReviewsPage extends React.Component {
  async componentDidMount() {
    await this.props.fetchConfigurations()
  }

  render() {
    const { isInitializing } = this.props

    const handleConfigurationChange = async (confId) => {
      this.props.setConfiguration(confId)

      this.props.setReviewData(
        await customerReviewService.getCustomerReviewAnswers(confId)
      )
    }

    const CustomerReviewsContainer = (props) => {
      const { reviews } = props
      return reviews.map((review) => (
        <Group group={review.group} key={review.group.id} />
      ))
    }

    const Group = ({ group }) => {
      return (
        <div
          className="customer-reviews-container__group"
          id={`review-${group.id}`}
        >
          <h2>{group.name}</h2>

          {!group.answerSheet ? (
            <p> No review submitted for group {group.name}</p>
          ) : (
            <Answers answerSheet={group.answerSheet} />
          )}
        </div>
      )
    }

    const Answers = ({ answerSheet }) => {
      return answerSheet.map((answer) => {
        if (answer.type === 'text' || answer.type === 'oneliner') {
          return <TextAnswer answer={answer} key={answer.id} />
        }

        if (answer.type === 'number' || answer.type === 'range') {
          return <NumberAnswer answer={answer} key={answer.id} />
        }
        //if there is something else, like instructions return null
        return null
      })
    }

    const TextAnswer = ({ answer }) => {
      return (
        <div className="customer-reviews-container__group__text-answer">
          <h3> {answer.questionHeader} </h3>
          <p>
            <b>Customer's answer:</b> {answer.answer}
          </p>
        </div>
      )
    }

    const NumberAnswer = ({ answer }) => {
      return (
        <div className="customer-reviews-container__group__number-answer">
          <h3> {answer.questionHeader} </h3>
          <p>
            {' '}
            <b>Customer's answer:</b> {answer.answer}{' '}
          </p>
        </div>
      )
    }

    const configurationMenuItems = () => {
      const { configurations } = this.props
      return []
        .concat(
          <MenuItem value={0} key={0} data-cy="all-configurations">
            All configurations
          </MenuItem>
        )
        .concat(
          configurations.map((configuration) => (
            <MenuItem
              value={configuration.id}
              key={configuration.id}
              data-cy={configuration.name}
            >
              {configuration.name}
            </MenuItem>
          ))
        )
    }

    const DownloadButton = ({ jsonData, fileName }) => {
      const data = `text/json;charset=utf-8,${encodeURIComponent(jsonData)}`
      const href = `data:${data}`

      return (
        <Button
          className="customer-review-download-button"
          component="a"
          href={href}
          download={fileName}
          variant="contained"
          color="primary"
        >
          Download as JSON
        </Button>
      )
    }

    if (this.props.reviewFetched) {
      return (
        <div className="customer-reviews-container">
          {isInitializing && (
            <LoadingCover className="customer-reviews-container__loading-cover" />
          )}

          <Select
            value={this.props.configuration}
            onChange={(event) => handleConfigurationChange(event.target.value)}
            data-cy="customer-reviews-select"
          >
            {configurationMenuItems()}
          </Select>
          <DownloadButton
            jsonData={JSON.stringify(this.props.reviewData)}
            fileName="customerReviews.json"
          />

          <h1 className="customer-reviews-h1">Customer reviews</h1>
          <CustomerReviewsContainer reviews={this.props.reviewData} />
        </div>
      )
    } else {
      return (
        <div className="customer-reviews-container">
          {isInitializing && (
            <LoadingCover className="customer-reviews-container__loading-cover" />
          )}
          <Select
            value={this.props.configuration}
            onChange={(event) => handleConfigurationChange(event.target.value)}
            data-cy="customer-reviews-select"
          >
            {configurationMenuItems()}
          </Select>
          <h1 className="customer-reviews-h1">Customer reviews</h1>
          <h3>No configuration selected!</h3>
          <h3>Please select a configuration!</h3>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    reviewFetched: state.viewCustomerReviewsPage.reviewFetched,
    isInitializing: state.viewCustomerReviewsPage.isInitializing,
    reviewData: state.viewCustomerReviewsPage.reviewData,
    configuration: state.viewCustomerReviewsPage.configurationId,
    configurations: state.configurationPage.configurations
  }
}

const mapDispatchToProps = {
  setLoading: viewCustomerReviewsPageActions.setLoading,
  setReviewData: viewCustomerReviewsPageActions.setReviewData,
  setConfiguration: viewCustomerReviewsPageActions.setConfiguration,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchConfigurations: configurationPageActions.fetchConfigurations
}

const ConnectedViewCustomerReviewsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewCustomerReviewsPage)

export default withRouter(ConnectedViewCustomerReviewsPage)
