import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getUser } from '../utils/functions'

import questionsJson from './questions/instructor_data'
//Actions
import appActions from '../reducers/actions/appActions'
import * as notificationActions from '../reducers/actions/notificationActions'
import instructorReviewPageActions from '../reducers/actions/instructorReviewPageActions.js'

//Services
import TextField from '@material-ui/core/TextField'

import groupManagementService from '../services/groupManagement'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import instructorReviewService from '../services/instructorReview'

class InstructorReviewPage extends React.Component {
  async componentDidMount() {
    try {
      const groups = await groupManagementService.getByInstructor()
      const answers = await instructorReviewService.getAllAnsweredGroupId()

      const filteredGroups = groups.filter((group) => {
        return !answers.includes(group.id)
      })
      if (filteredGroups.length === 0) {
        this.props.setSubmittedReview(true)
      } else if (filteredGroups.length > 0) {
        this.props.setGroups(filteredGroups)
        this.fetchInstructorReviewQuestions(
          filteredGroups[0].students,
          questionsJson,
          this.props.initializeAnswerSheet
        )
      }

    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Something is wrong... try reloading the page')
    }
  }

  async fetchInstructorReviewQuestions(
    students,
    questions,
    initializeAnswerSheet
  ) {
    const initializeNumberAnswer = (question, questionId) => {
      return {
        type: 'number',
        header: question.header,
        id: questionId,
        answer: ''
      }
    }

    const initializeTextAnswer = (question, questionId) => {
      return {
        type: 'text',
        header: question.header,
        id: questionId,
        answer: ''
      }
    }
    const emptyAnswerSheet = questions.questions.map((question, questionId) => {
      if (question.type === 'text') {
        return initializeTextAnswer(question, questionId)
      } else if (question.type === 'number') {
        return initializeNumberAnswer(question, questionId)
      } else {
        return question
      }
    })

    const initializeStudent = (name) => {
      const sheet = emptyAnswerSheet
      return {
        name: name,
        answers: sheet
      }
    }
    const tempAnswerSheet = students.map((student) => {
      return initializeStudent(student)
    })
    initializeAnswerSheet(tempAnswerSheet)
  }

  Submit = async (event, answerSheet, groupName, groupId) => {
    event.preventDefault()

    const answer = window.confirm(
      'Answers can not be changed after submitting. Continue?'
    )
    if (!answer) return
    this.props.selectGroup(0)
    try {
      await instructorReviewService.create({
        instructorReview: {
          group_id: groupId,
          group_name: groupName,
          answer_sheet: answerSheet,
          user_id: getUser().student_number
        }
      })

      this.props.setSuccess('Instructor review saved!')

      const groups = await groupManagementService.getByInstructor()
      const answers = await instructorReviewService.getAllAnsweredGroupId()

      const filteredGroups = groups.filter((group) => {
        return !answers.includes(group.id)
      })
      if (filteredGroups.length === 0) {
        this.props.setSubmittedReview(true)
      } else if (filteredGroups.length > 0) {
        this.props.setGroups(filteredGroups)
        this.fetchInstructorReviewQuestions(
          filteredGroups[0].students,
          questionsJson,
          this.props.initializeAnswerSheet
        )
      }
    } catch (e) {
      console.log('error happened', e)
      this.props.setError(e.response.data.error)
    }
  }

  render() {
    const {
      answerSheet,
      updateAnswer,
      submittedReview,
      groups,
      selectedGroup,
      selectGroup,
      initializeAnswerSheet
    } = this.props

    if (submittedReview === true) {
      return (
        <div>
          <h3>You have reviewed every group you are instructing.</h3>
        </div>
      )
    } else if (answerSheet && groups.length > 0) {
      return (
        <div>
          <ConfigurationSelectWrapper label="Select group">
            <ConfigurationSelect
              selectedGroup={selectedGroup}
              groups={groups}
              groupSelectHandler={groupSelectHandler}
              selectGroup={selectGroup}
              fetchInstructorReviewQuestions={
                this.fetchInstructorReviewQuestions
              }
              initializeAnswerSheet={initializeAnswerSheet}
            />
          </ConfigurationSelectWrapper>
          <h1>{groups[selectedGroup].groupName}</h1>

          <Reviews answerSheet={answerSheet} updateAnswer={updateAnswer} />
          <Button
            margin-right="auto"
            margin-left="auto"
            variant="contained"
            color="primary"
            data-cy="submit-instructor-review-button"
            onClick={(event) =>
              this.Submit(
                event,
                answerSheet,
                groups[selectedGroup].groupName,
                groups[selectedGroup].id
              )
            }
          >
            Submit
          </Button>
        </div>
      )
    } else {
      return (
        <div>
          <p>Loading.</p>
        </div>
      )
    }
  }
}

const groupSelectHandler = (
  value,
  selectGroup,
  fetchInstructorReviewQuestions,
  groups,
  initializeAnswerSheet
) => {
  if (
    !window.confirm('Changing group will wipe current inserted information.')
  ) {
    return
  }

  selectGroup(value)
  fetchInstructorReviewQuestions(
    groups[value].students,
    questionsJson,
    initializeAnswerSheet
  )
}
const ConfigurationSelectWrapper = ({ label, children }) => (
  <div style={{ padding: 20 }}>
    <Typography variant="caption">{label}</Typography>
    {children}
  </div>
)

const ConfigurationSelect = ({
  selectedGroup,
  groupSelectHandler,
  groups,
  fetchInstructorReviewQuestions,
  selectGroup,
  initializeAnswerSheet
}) => {
  return (
    <Select
      value={selectedGroup}
      onChange={(e) =>
        groupSelectHandler(
          e.target.value,
          selectGroup,
          fetchInstructorReviewQuestions,
          groups,
          initializeAnswerSheet
        )
      }
    >
      {groups.map((group, index) => (
        <MenuItem key={index} value={index}>
          {group.groupName}
        </MenuItem>
      ))}
    </Select>
  )
}
const Reviews = ({ answerSheet, updateAnswer }) => {
  return answerSheet.map((student, index) => {
    return (
      <div key={index}>
        <h1>{student.name.first_names + ' ' + student.name.last_name}</h1>
        <Questions
          studentAnswers={student.answers}
          updateAnswer={updateAnswer}
          userId={index}
        />
      </div>
    )
  })
}

const Questions = ({ studentAnswers, updateAnswer, userId }) => {
  return studentAnswers.map((question, questionId) => {
    if (question.type === 'text') {
      return (
        <div key={questionId + userId}>
          <h3>{question.header}</h3>
          <p>{question.description}</p>

          <TextField
            value={question.answer}
            rows="10"
            style={{ width: 700 }}
            multiline
            variant="outlined"
            data-cy={`textInput-${question.header} user:${userId}`}
            onChange={(e) =>
              textFieldHandler(e.target.value, userId, questionId, updateAnswer)
            }
          />
        </div>
      )
    } else if (question.type === 'number') {
      return (
        <div key={questionId + userId}>
          <h3>{question.header}</h3>
          <p>{question.description}</p>

          <input
            type="number"
            value={question.answer}
            data-cy={`numberInput-${question.header} user:${userId}`}
            onChange={(e) =>
              numberFieldHandler(
                e.target.value,
                userId,
                questionId,
                updateAnswer
              )
            }
          />
        </div>
      )
    } else if (question.type === 'info') {
      return (
        <div key={questionId + userId}>
          <h2>{question.header}</h2>
          <p>{question.description}</p>
        </div>
      )
    } else {
      return (
        <div key={questionId + userId}>
          <p>Incorrect question type</p>
        </div>
      )
    }
  })
}
const textFieldHandler = (value, userId, questionId, updateAnswer) => {
  updateAnswer(value, userId, questionId)
}
const numberFieldHandler = (value, userId, questionId, updateAnswer) => {
  updateAnswer(value, userId, questionId)
}

const mapStateToProps = (state) => {
  return {
    answerSheet: state.instructorReviewPage.answerSheet,
    submittedReview: state.instructorReviewPage.submittedReview,
    groups: state.instructorReviewPage.groups,
    selectedGroup: state.instructorReviewPage.selectedGroup
  }
}

const mapDispatchToProps = {
  ...instructorReviewPageActions,
  ...notificationActions,
  ...appActions
}
const ConnectedInstructorReviewPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstructorReviewPage)

export default withRouter(ConnectedInstructorReviewPage)
