import React from 'react'
import { connect } from 'react-redux'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import groupManagementService from '../../services/groupManagement'
import * as notificationActions from '../../reducers/actions/notificationActions'
import groupManagementActions from '../../reducers/actions/groupManagementActions'

import AutocompletedUserSelect from './AutocompletedUserSelect'
import TopicSelect from './TopicSelect'

const updateCreatedGroup = async (event, props) => {
  event.preventDefault()

  const {
    id,
    name,
    topicId,
    studentIds,
    instructor,
    configurationId
  } = props.group

  const splitStudents = studentIds
    .split(/[;, \n]/)
    .filter((str) => !!str)
    .map((student) => {
      if (student.length < 9) {
        return '0' + student.trim()
      } else {
        return student.trim()
      }
    })

  try {
    const updatedGroup = await groupManagementService.put({
      id: id,
      name: name,
      topicId: topicId,
      configurationId: configurationId,
      instructorId: instructor ? instructor.student_number : '',
      studentIds: splitStudents
    })

    props.updateExistingGroup(updatedGroup)

    props.toggleEditMode()

    props.setSuccess('Group updated!')
  } catch (e) {
    console.log(e)
    props.setError(`Failed to updated group! ${e.response.data.error}`)
  }
}

class SingleGroupEdit extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: props.group.id,
      name: props.group.name,
      topicId: props.group.topicId,
      configurationId: props.group.configurationId,
      instructor: props.users.find(
        (user) => user.student_number === props.group.instructorId
      ),
      studentIds: props.group.studentIds.join('\n')
    }
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  handleStudentChange = (event) => {
    this.setState({ studentIds: event.target.value })
  }

  handleInstructorChange = (newInstructor) => {
    this.setState({ instructor: newInstructor })
  }

  handleTopicChange = (newTopicId) => {
    const thistopic = this.props.topics.find((topic) => topic.id === newTopicId)

    this.setState({
      topicId: newTopicId,
      name: thistopic.content.title
    })
  }

  handleGroupDelete = async (e) => {
    e.preventDefault()
    if (!window.confirm(`Delete group ${this.state.name}?`)) {
      return
    }
    const groupId = this.state.id

    try {
      await groupManagementService.del({
        id: groupId
      })
      this.props.deleteGroup(groupId)

      this.props.setSuccess('Group deleted!')
    } catch (e) {
      this.props.setError(`Failed to delte! ${e.response.data.error}`)
    }
  }

  render() {
    const {
      group,
      topics,
      users,
      updateExistingGroup,
      toggleEditMode,
      setSuccess,
      setError,
      clearNotifications
    } = this.props

    const defaultInstructor =
      group.instructorId &&
      users.find((user) => user.student_number === group.instructorId)

    return (
      <div style={{ align: 'top', minWidth: '400px' }}>
        Edit group: {group.name}
        <IconButton
          aria-label="Delete"
          onClick={this.handleGroupDelete}
          data-cy="edit-group-delete-button"
        >
          <DeleteIcon fontSize="large" />
        </IconButton>
        <p>Edit group name</p>
        <TextField
          inputProps={{
            className: `edit-group-no__${group.id}__name`,
            'data-cy': 'edit-group-name-field'
          }}
          fullWidth={true}
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <p>Change topic</p>
        <TopicSelect
          topics={topics}
          onTopicSelectChange={this.handleTopicChange}
          groupTopicID={this.state.topicId}
          className="edit-group-form-topic__selector"
          fullWidth={true}
        />
        <p>Add new students</p>
        <TextField
          inputProps={{
            className: `edit-group-no__${group.id}__students`,
            'data-cy': 'edit-students-input'
          }}
          value={this.state.studentIds}
          onChange={this.handleStudentChange}
          data-cy="edit-group-students"
          multiline
          rows="8"
          fullWidth={true}
        />
        <p>Change instructor</p>
        <AutocompletedUserSelect
          className="edit-group-instructor"
          classNamePrefix="edit-group-instructor"
          selectedUser={this.state.instructor}
          defaultUser={defaultInstructor}
          onSelectedUserChange={this.handleInstructorChange}
          fullWidth={true}
        />
        <p>
          <Button
            style={{ marginLeft: '10px', height: '30px', float: 'right' }}
            color="primary"
            variant="contained"
            onClick={(event) =>
              updateCreatedGroup(event, {
                group: this.state,
                updateExistingGroup,
                toggleEditMode,
                setSuccess,
                setError,
                clearNotifications
              })
            }
            data-cy="edit-group-save-button"
          >
            Save
          </Button>
          <Button
            style={{ marginLeft: '10px', height: '30px', float: 'right' }}
            color="primary"
            variant="contained"
            onClick={() => toggleEditMode()}
          >
            Cancel
          </Button>
        </p>
      </div>
    )
  }
}

const mapStateToPropsForm = (state) => ({
  topics: state.topicListPage.topics,
  users: state.groupPage.users
})

const mapDispatchToPropsForm = {
  onTopicSelectChange: groupManagementActions.updateGroupTopicID,
  updateExistingGroup: groupManagementActions.updateExistingGroup,
  deleteGroup: groupManagementActions.deleteGroup,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess
}

export default connect(
  mapStateToPropsForm,
  mapDispatchToPropsForm
)(SingleGroupEdit)
