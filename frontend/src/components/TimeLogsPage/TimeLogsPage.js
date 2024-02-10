import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TimeLogForm } from './TimeLogForm'
import { TimeLogRow } from './TimeLogRow'
import { SprintSelect } from './SprintSelect'
import Typography from '@material-ui/core/Typography'
import timeLoggingService from '../../services/timeLogging'

import './TimeLogsPage.css'

const TimeLogsPage = () => {
  const [allLogs, setAllLogs] = useState([])
  const [sprintNumber, setSprintNumber] = useState(1) // TODO: determine current sprint.

  useEffect(() => {
    timeLoggingService.getTimeEntries()
      .then(fetchedData => {
        console.log('fetchedData:', fetchedData)
        setAllLogs(fetchedData)
      })
      .catch(error => {
        console.error('Error fetching time entries:', error)
      })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('submitting...')
  }

  const handleDelete = () => {
    console.log('deleting...')
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

  return (
    <div className="timelogs-container">
      <Typography variant="h4">Time Logs</Typography>
      <div className="timelogs-sprint-select-and-form">
        <SprintSelect
          sprintNumber={sprintNumber}
          handleClickNextSprint={handleClickNextSprint}
          handleClickPreviousSprint={handleClickPreviousSprint}
        />
        <TimeLogForm handleSubmit={handleSubmit} />
      </div>
      <div className="timelogs-logs">
        {isLogs(logsBySprint) &&
          logsBySprint.map((log) => (
            <TimeLogRow key={log.id} log={log} handleDelete={handleDelete} />
          ))}
        {!isLogs(logsBySprint) && <p>No logs yet :&#40;</p>}
      </div>
    </div>
  )
}

const mapStateToProps = () => {}

const mapDispatchToProps = {}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeLogsPage)
)
