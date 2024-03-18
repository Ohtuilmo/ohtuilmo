import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TimeLogForm } from './TimeLogForm'
import { TimeLogRow } from './TimeLogRow'
import { NotInGroupPlaceholder } from '../common/Placeholders'
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
  const [selectedSprintNumber, setSelectedSprintNumber] = useState(1)

  const { studentNumber, group, initializeMyGroup } = props

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        await initializeMyGroup()
      } catch (error) {
        console.error('Error fethcing group:', error.message, ' / ' , error.response.data.error)
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchTimeLogs = async () => {
      try {
        const fetchedData = await timeLogsService.getTimeLogs()
        setAllLogs(fetchedData)
      } catch (error) {
        console.error('Error fethcing timelogs:', error.message, ' / ' , error.response.data.error)
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchSprints = async () => {
      try {
        const fetchedData = await sprintService.getSprints()
        setAllSprints(fetchedData)
      } catch (error) {
        console.error('Error fethcing sprints:', error.message, ' / ' , error.response.data.error)
        notificationActions.setError(error.response.data.error)
      }
    }

    fetchGroup()
    fetchSprints()
    fetchTimeLogs()
  }, [])

  useEffect(() => {
    const today = new Intl.DateTimeFormat('fi-FI', {
      timeZone: 'Europe/Helsinki',
    }).format(new Date())

    const currentSprintObject = allSprints.find((sprint) =>
      today >= sprint.start_date && today <= sprint.end_date ? sprint : {}
    )

    currentSprintObject && setCurrentSprintNumber(currentSprintObject.sprint)
    currentSprintObject && setSelectedSprintNumber(currentSprintObject.sprint)
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
    } catch (error) {
      console.error('Error creating time log:', error.message, ' / ' , error.response.data.error)
      props.setError(error.response.data.error)
    }
  }

  const handleDelete = async (logId) => {
    try {
      const updatedLogs = await timeLogsService.deleteTimeLog(logId)
      setAllLogs(updatedLogs)
    } catch (error) {
      console.error('Error deleting time log:', error.message, ' / ' , error.response.data.error)
      props.setError(error.response.data.error)
    }
  }

  const handleClickNextSprint = () => {
    setSelectedSprintNumber(selectedSprintNumber + 1)
  }

  const handleClickPreviousSprint = () => {
    setSelectedSprintNumber(selectedSprintNumber - 1)
  }

  const isLogs = (logs) => logs && logs.length > 0

  const logsBySprint =
    isLogs(allLogs) &&
    allLogs.filter((log) => log.sprint === selectedSprintNumber)

  if (!group) return <NotInGroupPlaceholder />

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
      {isLogs(logsBySprint) &&
        logsBySprint.map((log) => (
          <TimeLogRow
            key={log.id}
            log={log}
            handleDelete={() => handleDelete(log.id)}
          />
        ))}
      {!isLogs(logsBySprint) && <p>No logs yet :&#40;</p>}
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
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeLogsPage)
)
