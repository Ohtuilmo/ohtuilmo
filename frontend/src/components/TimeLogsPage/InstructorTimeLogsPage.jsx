import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { TimeLogsSelectForm } from './TimeLogsSelectForm'
import { TimeLogRow } from './TimeLogRow'
import TimeLogChart from './TimeLogChart'
import LoadingSpinner from '../common/LoadingSpinner'
import { SprintSelect } from './SprintSelect'
import ConfirmationDialog from '../common/ConfirmationDialog'

import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import userService from '../../services/user'
import configurationService from '../../services/configuration'
import groupManagementService from '../../services/groupManagement'
import timeLogsService from '../../services/timeLogs'
import instructorTimeLogsService from '../../services/instructorTimeLogs'

import * as notificationActions from '../../reducers/actions/notificationActions'
import timeLogsActions from '../../reducers/actions/timeLogsActions'

const InstructorTimeLogsPage = (props) => {
  const {
    selectedSprintNumber,
    setSelectedSprintNumber,
    setGroupSprintSummary,
    user,
  } = props

  const [allConfigurations, setAllConfigurations] = useState([])
  const [selectedConfiguration, setSelectedConfiguration] = useState(null)
  const [allGroups, setAllGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null)
  const [allLogs, setAllLogs] = useState(null)
  const [checkedTimeLogs, setCheckedTimeLogs] = useState([])
  const [moveToPreviousSprintConfirmOpen, setMoveToPreviousSprintConfirmOpen] = useState(false)
  const [moveToNextSprintConfirmOpen, setMoveToNextSprintConfirmOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const possibleSprintNumbers = Array.from({ length: 101 }, (_, i) => i)

  useEffect(() => {
    const fetchAllConfigurations = async () => {
      try {
        const allConfigurations = await configurationService.getAll()
        setAllConfigurations(allConfigurations.configurations)
      } catch (error) {
        console.error(
          'Error fetching groups:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }

    const fetchAllGroups = async () => {
      try {
        const allGroups = await groupManagementService.get()
        setAllGroups(allGroups)
      } catch (error) {
        console.error(
          'Error fetching groups:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }

    const fetchAllStudents = async () => {
      try {
        const allStudents = await userService.get()
        setAllStudents(allStudents)
      } catch (error) {
        console.error(
          'Error fetching students:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }

    const fetchAllLogs = async () => {
      try {
        const allLogs = await instructorTimeLogsService.getTimeLogs()
        setAllLogs(allLogs)
      } catch (error) {
        console.error(
          'Error fetching logs:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }

    const fetchData = async () => {
      setIsLoading(true)
      await fetchAllConfigurations()
      await fetchAllGroups()
      await fetchAllStudents()
      await fetchAllLogs()
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (allConfigurations.length > 0 && allGroups.length > 0) {
      const allGroupsInSortedOrder = [...allGroups] // clones the array
      allGroupsInSortedOrder.sort((a, b) => a.id - b.id)
      const newestGroupByInstructor = allGroupsInSortedOrder.findLast(
        group => group.instructorId === user.user.student_number
      )
      const configurationByInstructor = allConfigurations.find(
        configuration =>
          newestGroupByInstructor && newestGroupByInstructor.configurationId === configuration.id
      )
      setSelectedConfiguration(configurationByInstructor)
      setSelectedGroup(newestGroupByInstructor)
    }
  }, [allConfigurations, allGroups])

  useEffect(() => {
    const fetchGroupSprintSummary = async (group_id) => {
      try {
        const summaryData = await timeLogsService.getGroupSprintSummary(group_id)
        setGroupSprintSummary(JSON.parse(summaryData))
        setSelectedSprintNumber(0)
      } catch (error) {
        console.error(
          'Error fetching group sprint summary:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }

    const fetchChartData = async (selectedGroupId) => {
      setIsLoading(true)
      await fetchGroupSprintSummary(selectedGroupId)
      setIsLoading(false)
    }
    selectedGroup?.id && fetchChartData(selectedGroup.id)
  }, [selectedGroup])

  const handleTimeLogCheck = (logId) => {
    setCheckedTimeLogs((prevChecked) => (
      prevChecked.includes(logId) ? prevChecked.filter(id => id !== logId) : [...prevChecked, logId]
    ))
  }

  const handleMoveTimeLog = async (direction) => {
    if (checkedTimeLogs.length === 0) {
      props.setError('No time logs selected')
      return
    }
    for (const logId in checkedTimeLogs) {
      try {
        const updatedLogs = await instructorTimeLogsService.moveTimeLog(direction, checkedTimeLogs[logId])
        setAllLogs(updatedLogs)
        props.setSuccess('Selected time logs moved successfully')
        setCheckedTimeLogs([])
      } catch (error) {
        console.error(
          'Error moving time log:',
          error.message,
          ' / ',
          error.response.data.error
        )
        props.setError(error.response.data.error)
      }
    }
  }

  const handleDelete = async (logId) => {
    try {
      const updatedLogs = await instructorTimeLogsService.deleteTimeLog(logId)
      setAllLogs(updatedLogs)
      props.setSuccess('Time log deleted successfully')
    } catch (error) {
      props.setError('Error deleting time log')
    }
  }

  const previousSprint = [...possibleSprintNumbers]
    .reverse()
    .find((sprint) => sprint < selectedSprintNumber)

  const nextSprint = possibleSprintNumbers.find(
    (sprint) => sprint > selectedSprintNumber
  )

  const handleClickNextSprint = () => {
    setSelectedSprintNumber(
      nextSprint !== undefined ? nextSprint : selectedSprintNumber
    )
    setCheckedTimeLogs([])
  }

  const handleClickPreviousSprint = () => {
    setSelectedSprintNumber(
      previousSprint !== undefined ? previousSprint : selectedSprintNumber
    )
    setCheckedTimeLogs([])
  }

  const handleStudentChange = (studentNumber) => {
    setSelectedStudentNumber(studentNumber)
    setCheckedTimeLogs([])
  }

  const isLogs = (logs) => logs && logs.length > 0
  const logsByStudentAndSelectedSprint =
    isLogs(allLogs) && allLogs.filter((log) => log.studentNumber === selectedStudentNumber && log.sprint === selectedSprintNumber)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className='timelogs-responsive-grid'>
      <div id='timelogs-container-1'>
        <div>
          <TimeLogsSelectForm
            configurations={allConfigurations}
            selectedConfiguration={selectedConfiguration}
            handleConfigurationChange={setSelectedConfiguration}
            groups={allGroups}
            selectedGroup={selectedGroup}
            handleGroupChange={setSelectedGroup}
            students={allStudents}
            selectedStudentNumber={selectedStudentNumber}
            handleStudentNumberChange={handleStudentChange}
          />
          {selectedGroup && (
            <div>
              <Typography variant='h5'>Timelogs by {selectedGroup.name}</Typography>
              <SprintSelect
                sprintNumber={selectedSprintNumber}
                handleClickNextSprint={handleClickNextSprint}
                handleClickPreviousSprint={handleClickPreviousSprint}
                nextSprintButtonDisabled={nextSprint === undefined}
                previousSprintButtonDisabled={previousSprint === undefined}
              />
            </div>
          )}
        </div>
        <div id='timelog-rows'>
          {isLogs(logsByStudentAndSelectedSprint) && checkedTimeLogs.length>0 && (
            <div style={{ paddingTop: 25, paddingBottom: 25 }}>
              <span className='text' style={{ paddingRight: 12 }}>
                Move selected logs to
              </span>
              <Button
                variant="outlined"
                size="small"
                id={'timelog-move-button-previous'}
                className="timelog-move-button"
                style={{ padding: '0 12px', marginRight: '12px' }}
                disableRipple
                onClick={() => setMoveToPreviousSprintConfirmOpen(true)}
              >
               previous sprint
              </Button>
              <ConfirmationDialog
                title="Move Time Logs?"
                open={moveToPreviousSprintConfirmOpen}
                setOpen={setMoveToPreviousSprintConfirmOpen}
                onConfirm={() => handleMoveTimeLog('previous')}
              >
               Move selected time logs to previous sprint?
              </ConfirmationDialog>
              <Button
                variant="outlined"
                size="small"
                id={'timelog-move-button-next'}
                className="timelog-move-button"
                style={{ padding: '0 12px' }}
                disableRipple
                onClick={() => setMoveToNextSprintConfirmOpen(true)}
              >
                next sprint
              </Button>
              <ConfirmationDialog
                title="Move Time Logs?"
                open={moveToNextSprintConfirmOpen}
                setOpen={setMoveToNextSprintConfirmOpen}
                onConfirm={() => handleMoveTimeLog('next')}
              >
                Move selected time logs to next sprint?
              </ConfirmationDialog>
            </div>
          )}
          {isLogs(logsByStudentAndSelectedSprint) && logsByStudentAndSelectedSprint.map((log) => (
            <TimeLogRow
              key={log.id}
              log={log}
              handleDelete={() => handleDelete(log.id)}
              handleTimeLogCheck={() => handleTimeLogCheck(log.id)}
              isChecked={checkedTimeLogs.includes(log.id)}
              user={user.user}
            />
          ))}
          {!isLogs(logsByStudentAndSelectedSprint) && (
            <p>No logs for the selected sprint.</p>
          )}
        </div>
      </div>
      <div id='chart-container'>
        {selectedGroup &&
          <div className='timelogs-charts-container'>
            <div className='timelogs-chart-and-title-container'>
              <Typography variant='h5'>Sprint Chart</Typography>
              <TimeLogChart chartVariant='sprint' />
            </div>
            <div className='timelogs-chart-and-title-container'>
              <Typography variant='h5'>Project Chart</Typography>
              <TimeLogChart chartVariant='total' />
            </div>
          </div>
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  state: state,
  selectedSprintNumber: state.timeLogs.selectedSprintNumber,
  user: state.login.user,
})

const mapDispatchToProps = {
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  setGroupSprintSummary: timeLogsActions.setGroupSprintSummary,
  setSelectedSprintNumber: timeLogsActions.setSelectedSprintNumber,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InstructorTimeLogsPage)
)
