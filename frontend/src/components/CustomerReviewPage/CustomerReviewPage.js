import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './CustomerReviewPage.css'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'

import * as notificationActions from '../../reducers/actions/notificationActions'
import customerReviewPageActions from '../../reducers/actions/customerReviewPageActions'

import customerReviewService from '../../services/customerReview'

/**
 * @typedef {{value: any, onValueChange: function, options?: object}} InputComponentProps
 * @typedef {(props: InputComponentProps) => any} InputComponent
 */

const passEventValueTo = (callback) => (e) => callback(e.target.value)
const withParseInt = (callback) => (value) => callback(parseInt(value, 10))

/** @type {InputComponent} */
const TextInput = ({ value, onValueChange, ...textFieldProps }) => (
  <TextField
    {...textFieldProps}
    value={value}
    rows="8"
    fullWidth
    multiline
    variant="outlined"
    onChange={passEventValueTo(onValueChange)}
  />
)

/** @type {InputComponent} */
const OnelinerInput = ({ value, onValueChange, ...textFieldProps }) => (
  <TextField
    {...textFieldProps}
    value={value}
    variant="outlined"
    onChange={passEventValueTo(onValueChange)}
  />
)

/** @type {InputComponent} */
const NumberInput = ({ value, onValueChange, ...inputProps }) => (
  <input
    {...inputProps}
    type="number"
    value={value}
    style={{ fontSize: 'inherit', lineHeight: '2em' }}
    variant="outlined"
    onChange={passEventValueTo(withParseInt(onValueChange))}
  />
)

const defaultOptions = ['1', '2', '3', '4', '5']

/** @type {InputComponent} */
const RangeInput = ({ value, onValueChange, options, ...inputProps }) => {
  const makeRadio = () => <Radio color="primary" />

  const inputs = (options || defaultOptions).map((option) => (
    <FormControlLabel
      key={option}
      value={`${option}`}
      control={makeRadio()}
      label={`${option}`}
      labelPlacement="top"
    />
  ))

  return (
    <RadioGroup
      {...inputProps}
      value={`${value}`}
      onChange={passEventValueTo(onValueChange)}
      row
    >
      {inputs}
    </RadioGroup>
  )
}

/**
 * Gets the input component for the specified question type, or returns
 * undefined if none found.
 * @returns {InputComponent | undefined}
 */
const getQuestionInputComponent = (type) => {
  const typeToComponent = {
    text: TextInput,
    number: NumberInput,
    range: RangeInput,
    oneliner: OnelinerInput
  }
  return typeToComponent[type]
}

const Question = ({ question, answer, onAnswerChange }) => {
  const InputComponent = getQuestionInputComponent(question.type)

  const input = InputComponent && (
    <InputComponent
      value={answer}
      onValueChange={onAnswerChange}
      options={question.options}
      required
      data-cy={`${question.type}Input-${question.header}`}
    />
  )

  return (
    <div className="customer-review-box">
      <Typography variant="h6" className="customer-review-box__header">
        {question.header}
      </Typography>
      <p>{question.description}</p>
      {input}
    </div>
  )
}

const Questions = ({ questions, answerSheet, onAnswerUpdate }) => {
  return (
    <div className="customer-review-questions">
      {questions.map((question, questionId) => {
        const currentAnswer = answerSheet[questionId].answer
        const onAnswerChange = (answer) => onAnswerUpdate(answer, questionId)

        return (
          <Question
            key={questionId}
            question={question}
            answer={currentAnswer}
            onAnswerChange={onAnswerChange}
          />
        )
      })}
    </div>
  )
}

class CustomerReviewPage extends React.Component {
  async componentDidMount() {
    const id = this.props.match.params.id
    try {
      const group = await customerReviewService.getDataForReview(id)
      if (group) {
        this.props.setReview(group.hasAnswered)
        this.props.setGroupName(group.groupName)
        this.props.setGroupId(group.groupId)
        this.props.setTopicId(group.topicId)
        this.props.setConfiguration(group.configuration)
        const reviewQuestionSet = await customerReviewService.getReviewQuestions(
          group.configuration
        )

        this.props.setQuestions(reviewQuestionSet.questions)

        this.fetchCustomerReviewQuestions(this.props.questionObject)
      } else {
        this.props.setNoGroup(true)
      }
    } catch (e) {
      console.log(e)
      this.props.setError('Some error happened')
    }
  }

  async fetchCustomerReviewQuestions(questionObject) {
    const initializeNumberAnswer = (question, questionId) => {
      return {
        type: 'number',
        questionHeader: question.header,
        id: questionId,
        answer: 0
      }
    }

    const initializeTextAnswer = (question, questionId) => {
      return {
        type: 'text',
        questionHeader: question.header,
        id: questionId,
        answer: ''
      }
    }

    const initializeOnelinerAnswer = (question, questionId) => {
      return {
        type: 'oneliner',
        questionHeader: question.header,
        id: questionId,
        answer: ''
      }
    }

    const initializeRangeAnswer = (question, questionId) => ({
      type: 'range',
      questionHeader: question.header,
      questionOptions: question.options,
      id: questionId,
      answer: null
    })

    const initializers = {
      number: initializeNumberAnswer,
      text: initializeTextAnswer,
      range: initializeRangeAnswer,
      oneliner: initializeOnelinerAnswer
    }

    const tempAnswerSheet = questionObject.map((question, questionID) => {
      const initializer = initializers[question.type]
      return initializer ? initializer(question, questionID) : question
    })

    this.props.initializeAnswerSheet(tempAnswerSheet)
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    const answer = window.confirm(
      'Answers can not be changed after submitting. Continue?'
    )
    if (!answer) return
    try {
      await customerReviewService.create({
        customerReview: {
          answer_sheet: this.props.answerSheet,
          group_id: this.props.groupId,
          topic_id: this.props.topicId,
          configuration_id: this.props.configuration
        }
      })

      this.props.setSuccess('Review saved!')
      this.props.setReview(true)
    } catch (e) {
      console.log('error happened', e)
      this.props.setError(e.response.data.error)
    }
  }

  render() {
    const {
      answerSheet,
      updateAnswer,
      isInitializing,
      hasReviewed,
      questionObject,
      groupName,
      noGroup
    } = this.props

    if (isInitializing) {
      return (
        <div className="customer-review-container">
          <h1 className="customer-review-container__h1">Loading!</h1>
        </div>
      )
    }
    if (hasReviewed) {
      return (
        <div className="customer-review-container">
          <h1 className="customer-review-container__h1">
            Thank you for the review
          </h1>
        </div>
      )
    }
    if (noGroup) {
      return (
        <div className="customer-review-container">
          <h1 className="customer-review-container__h1">
            No group assigned for topic!
          </h1>
        </div>
      )
    } else {
      return (
        <div className="customer-review-container">
          <h1 className="customer-review-container__h1">Customer review</h1>
          <h1 className="customer-review-container__h1">{groupName}</h1>

          <Paper elevation={1} className="customer-review-container__main">
            <form onSubmit={this.handleSubmit}>
              <Questions
                questions={questionObject}
                answerSheet={answerSheet}
                onAnswerUpdate={updateAnswer}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  margin-right="auto"
                  margin-left="auto"
                  variant="contained"
                  color="primary"
                  type="submit"
                  data-cy="submit-customer-review-button"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Paper>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    groups: state.groupPage.groups,
    answerSheet: state.customerReviewPage.answerSheet,
    isInitializing: state.customerReviewPage.isInitializing,
    hasReviewed: state.customerReviewPage.hasReviewed,
    questionObject: state.customerReviewPage.questions,
    groupName: state.customerReviewPage.groupName,
    groupId: state.customerReviewPage.groupId,
    topicId: state.customerReviewPage.topicId,
    configuration: state.customerReviewPage.configuration,
    noGroup: state.customerReviewPage.noGroup
  }
}

const mapDispatchToProps = {
  updateAnswer: customerReviewPageActions.updateAnswer,
  initializeAnswerSheet: customerReviewPageActions.initializeAnswerSheet,
  setLoading: customerReviewPageActions.setLoading,
  setReview: customerReviewPageActions.setReview,
  setQuestions: customerReviewPageActions.setQuestions,
  setGroupName: customerReviewPageActions.setGroupName,
  setGroupId: customerReviewPageActions.setGroupId,
  setTopicId: customerReviewPageActions.setTopicId,
  setConfiguration: customerReviewPageActions.setConfiguration,
  setNoGroup: customerReviewPageActions.setNoGroup,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess
}

const ConnectedCustomerReviewPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerReviewPage)
export default withRouter(ConnectedCustomerReviewPage)
