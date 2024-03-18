import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TimeLogForm } from './TimeLogForm'
import { TimeLogRow } from './TimeLogRow'
import {
  NotInGroupPlaceholder,
  LoadingPlaceholder,
} from '../common/Placeholders'
import { SprintSelect } from './SprintSelect'
import { Typography } from '@material-ui/core'
import timeLogsService from '../../services/timeLogs'
import {
  minutesAndHoursFromString,
  hoursAndMinutesToMinutes,
} from '../../utils/functions'

import './TimeLogsPage.css'

const TimeLogsPage = (props) => {
  const [allLogs, setAllLogs] = useState([])
  const [sprintNumber, setSprintNumber] = useState(1) // TODO: determine current sprint.

  const { studentNumber, group, isLoading } = props

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const fetchedData = await timeLogsService.getTimeLogs()
        setAllLogs(fetchedData)
      } catch (error) {
        console.error('Error fetching logs:', error)
      }
    }

    fetchTimeLogs()
  }, [])

  const handleSubmit = async (date, time, description) => {
    const log = {
      studentNumber,
      sprint: sprintNumber,
      date,
      minutes: hoursAndMinutesToMinutes(minutesAndHoursFromString(time)),
      description,
      tags: [],
      groupId: group.id,
    }

    const updatedLogs = await timeLogsService.createTimeLog(log)
    setAllLogs(updatedLogs)
  }

  const handleDelete = async (logId) => {
    const updatedLogs = await timeLogsService.deleteTimeLog(logId)
    setAllLogs(updatedLogs)
  }

  const handleClickNextSprint = () => {
    setSprintNumber(sprintNumber + 1)
  }

  const handleClickPreviousSprint = () => {
    setSprintNumber(sprintNumber - 1)
  }

  const isLogs = (logs) => logs && logs.length > 0

  const logsBySprint =
    isLogs(allLogs) && allLogs.filter((log) => log.sprint === sprintNumber)

  if (isLoading) return <LoadingPlaceholder />
  if (!group) return <NotInGroupPlaceholder />

  return (
    <div className="timelogs-container-1">
      <div className="timelogs-container-2">
        <div className="timelogs-container-3">
          <Typography variant="h4">Time Logs</Typography>
          <SprintSelect
            sprintNumber={sprintNumber}
            handleClickNextSprint={handleClickNextSprint}
            handleClickPreviousSprint={handleClickPreviousSprint}
          />
        </div>
        <TimeLogForm handleSubmit={handleSubmit} />
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
  isLoading: state.app.isLoading,
})

const mapDispatchToProps = {}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeLogsPage),
)
