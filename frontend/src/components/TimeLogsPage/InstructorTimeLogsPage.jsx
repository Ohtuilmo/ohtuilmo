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
  const [previousMoveConfirmOpen, setPreviousMoveConfirmOpen] = useState(false)
  const [nextMoveConfirmOpen, setNextMoveConfirmOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const possibleSprintNumbers = Array.from({length: 101}, (_, i) => i)

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
          newestGroupByInstructor.configurationId === configuration.id
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

  useEffect(() => {
    setCheckedTimeLogs(checkedTimeLogs)
  }, [checkedTimeLogs, setCheckedTimeLogs])

  const handleTimeLogCheck = (logId) => {
    setCheckedTimeLogs((prevChecked) => (
      prevChecked.includes(logId) ? prevChecked.filter(id => id !== logId) : [...prevChecked, logId]
    ))
  }

  const handleMoveTimeLogToPreviousSprint = async (logId) => {
    if (checkedTimeLogs.length > 0) {
      for (logId in checkedTimeLogs) {
        try {
          const updatedLogs = await instructorTimeLogsService.moveTimeLogToPreviousSprint(checkedTimeLogs[logId])
          setAllLogs(updatedLogs)
          props.setSuccess('Time log moved to previous sprint successfully')
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
  }

  const handleMoveTimeLogToNextSprint = async (logId) => {
    if (checkedTimeLogs.length > 0) {
      for (logId in checkedTimeLogs) {
        try {
          const updatedLogs = await instructorTimeLogsService.moveTimeLogToNextSprint(checkedTimeLogs[logId])
          setAllLogs(updatedLogs)
          props.setSuccess('Time log moved to next sprint successfully')
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
  }

  const handleClickPreviousSprint = () => {
    setSelectedSprintNumber(
      previousSprint !== undefined ? previousSprint : selectedSprintNumber
    )
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
            handleStudentNumberChange={setSelectedStudentNumber}
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
          {isLogs(logsByStudentAndSelectedSprint) && (
            <div>
              <span className='text' style={{ padding: '0 12px 0 0' }}>
                Move selected logs to
              </span>
              <Button
               variant="outlined"
               size="small"
               id={`timelog-move-button-previous`}
               className="timelog-move-button"
               style={{ padding: '0 12px', marginRight: '12px' }}
               disableRipple
               onClick={() => setPreviousMoveConfirmOpen(true)}
              >
               previous sprint
              </Button>
              <ConfirmationDialog
               title="Move Selected Time Logs to previous sprint?"
               open={previousMoveConfirmOpen}
               setOpen={setPreviousMoveConfirmOpen}
               onConfirm={() => handleMoveTimeLogToPreviousSprint()}
              >
               Move selected time logs to previous sprint?
              </ConfirmationDialog>
              <Button
               variant="outlined"
               size="small"
               id={`timelog-move-button-next`}
               className="timelog-move-button"
               style={{ padding: '0 12px' }}
               disableRipple
               onClick={() => setNextMoveConfirmOpen(true)}
              >
                next sprint
              </Button>
              <ConfirmationDialog
               title="Move Selected Time Logs to next sprint?"
               open={nextMoveConfirmOpen}
               setOpen={setNextMoveConfirmOpen}
               onConfirm={() => handleMoveTimeLogToNextSprint()}
              >
                Move selected time logs to next sprint?
              </ConfirmationDialog>
            </div>
          )}
          {isLogs(logsByStudentAndSelectedSprint) && logsByStudentAndSelectedSprint.map((log) => (
            <TimeLogRow
              key={log.id}
              log={log}
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
