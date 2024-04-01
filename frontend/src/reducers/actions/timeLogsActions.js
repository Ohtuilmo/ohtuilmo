
import timeLogsService from '../../services/timeLogs'

const setSelectedSprintNumber = (sprintNumber) => {
  return {
    type: 'SET_SELECTED_SPRINT_NUMBER',
    payload: sprintNumber
  }
}

const setCurrentSprintNumber = (sprintNumber) => {
  return {
    type: 'SET_CURRENT_SPRINT_NUMBER',
    payload: sprintNumber
  }
}

const resetGroupSprintSummary = () => {
  return {
    type: 'RESET_GROUP_SPRINT_SUMMARY'
  }
}

const setGroupSprintSummary = (groupSprintSummary) => {
  return {
    type: 'SET_GROUP_SPRINT_SUMMARY',
    payload: groupSprintSummary
  }
}

const fetchGroupSprintSummary = () => {
  return async (dispatch) => {
    const groupSprintSummary = timeLogsService.getGroupSprintSummary()
    if (groupSprintSummary) {
      dispatch({
        type: 'SET_GROUP_SPRINT_SUMMARY',
        payload: groupSprintSummary
      })
    }
  }
}

export default {
  resetGroupSprintSummary,
  setGroupSprintSummary,
  fetchGroupSprintSummary,
  setCurrentSprintNumber,
  setSelectedSprintNumber
}
