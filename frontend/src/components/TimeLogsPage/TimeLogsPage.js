import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TimeLogForm } from './TimeLogForm'
import { TimeLogRow } from './TimeLogRow'
import {
  NotInGroupPlaceholder,
  NoSprintsPlaceholder,
} from '../common/Placeholders'
import LoadingSpinner from '../common/LoadingSpinner'
import { SprintSelect } from './SprintSelect'
import { Typography } from '@material-ui/core'
import timeLogsService from '../../services/timeLogs'
import sprintService from '../../services/sprints'
import myGroupActions from '../../reducers/actions/myGroupActions'
import {
  minutesAndHoursFromString,
  hoursAndMinutesToMinutes,
} from '../../utils/functions'
import './TimeLogsPage.css'
import * as notificationActions from '../../reducers/actions/notificationActions'

const TimeLogsPage = (props) => {
  const [allLogs, setAllLogs] = useState([])
  const [allSprints, setAllSprints] = useState([])
  const [currentSprintNumber, setCurrentSprintNumber] = useState(null)
  const [selectedSprintNumber, setSelectedSprintNumber] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const { studentNumber, group, initializeMyGroup } = props
  const existingSprintNumbers = allSprints.map((sprint) => sprint.sprint).sort()

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        await initializeMyGroup()
      } catch (error) {
        console.error(
          'Error fetching group:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchTimeLogs = async () => {
      try {
        const fetchedData = await timeLogsService.getTimeLogs()
        setAllLogs(fetchedData)
      } catch (error) {
        console.error(
          'Error fetching timelogs:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchSprints = async () => {
      try {
        const fetchedData = await sprintService.getSprints()
        setAllSprints(fetchedData)
      } catch (error) {
        console.error(
          'Error fetching sprints:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchData = async () => {
      setIsLoading(true)
      await fetchGroup()
      await fetchSprints()
      await fetchTimeLogs()
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const today = new Date()
    const currentSprintObject = allSprints.find(
      (sprint) =>
        today >= new Date(sprint.start_date) &&
        today <= new Date(sprint.end_date)
    )

    currentSprintObject && setCurrentSprintNumber(currentSprintObject.sprint)
    currentSprintObject && setSelectedSprintNumber(currentSprintObject.sprint)
    !currentSprintObject &&
      setSelectedSprintNumber(
        existingSprintNumbers.length > 0 ? existingSprintNumbers[0] : null
      )
  }, [allSprints])

  const handleSubmit = async (date, time, description) => {
    const log = {
      studentNumber,
      sprint: selectedSprintNumber,
      date,
      minutes: hoursAndMinutesToMinutes(minutesAndHoursFromString(time)),
      description,
      tags: [],
      groupId: group.id,
    }
    try {
      const updatedLogs = await timeLogsService.createTimeLog(log)
      setAllLogs(updatedLogs)
      props.setSuccess('Time log created successfully')
    } catch (error) {
      console.error(
        'Error creating time log:',
        error.message,
        ' / ',
        error.response.data.error
      )
      props.setError(error.response.data.error)
    }
  }

  const handleDelete = async (logId) => {
    try {
      const updatedLogs = await timeLogsService.deleteTimeLog(logId)
      setAllLogs(updatedLogs)
      props.setSuccess('Time log deleted successfully')
    } catch (error) {
      console.error(
        'Error deleting time log:',
        error.message,
        ' / ',
        error.response.data.error
      )
      props.setError(error.response.data.error)
    }
  }

  const handleClickNextSprint = () => {
    setSelectedSprintNumber(
      existingSprintNumbers.find((sprint) => sprint > selectedSprintNumber) ||
        selectedSprintNumber
    )
  }

  const handleClickPreviousSprint = () => {
    setSelectedSprintNumber(
      existingSprintNumbers.find((sprint) => sprint < selectedSprintNumber) ||
        selectedSprintNumber
    )
  }

  const isLogs = (logs) => logs && logs.length > 0

  const logsBySprint =
    isLogs(allLogs) &&
    allLogs.filter((log) => log.sprint === selectedSprintNumber)

  if (isLoading) return <LoadingSpinner />
  if (!group) return <NotInGroupPlaceholder />
  if (allSprints.length === 0) return <NoSprintsPlaceholder />

  return (
    <div className="timelogs-container-1">
      <div className="timelogs-container-2">
        <div className="timelogs-container-3">
          <Typography variant="h4">Time Logs</Typography>
          <SprintSelect
            sprintNumber={selectedSprintNumber}
            handleClickNextSprint={handleClickNextSprint}
            handleClickPreviousSprint={handleClickPreviousSprint}
          />
        </div>
        <TimeLogForm
          handleSubmit={handleSubmit}
          disabled={selectedSprintNumber !== currentSprintNumber}
        />
      </div>
      <div id="timelog-rows">
        {isLogs(logsBySprint) &&
          logsBySprint.map((log) => (
            <TimeLogRow
              key={log.id}
              log={log}
              handleDelete={() => handleDelete(log.id)}
            />
          ))}
        {!isLogs(logsBySprint) && allSprints.length > 0 && (
          <p>No logs yet :&#40;</p>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  state: state,
  studentNumber: state.login.user.user.student_number,
  group: state.registrationDetails.myGroup,
})

const mapDispatchToProps = {
  initializeMyGroup: myGroupActions.initializeMyGroup,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeLogsPage)
)
