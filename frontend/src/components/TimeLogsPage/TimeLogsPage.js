import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TimeLogForm } from './TimeLogForm'
import { TimeLogRow } from './TimeLogRow'
import { SprintSelect } from './SprintSelect'
import Typography from '@material-ui/core/Typography'

import './TimeLogsPage.css'

// TODO: remove when done.
const exampleData = [
  {
    id: 1,
    studentNumber: '12345678',
    date: '2024-04-01',
    description: 'Reviewed a PR from Pekka.',
    minutes: 60,
    sprint: 1,
    tags: ['frontend', 'backend'],
    groupId: '23567836',
  },
  {
    id: 2,
    studentNumber: '12345678',
    date: '2024-04-02',
    description: 'Worked on bug fixes.',
    minutes: 120,
    sprint: 1,
    tags: ['backend'],
    groupId: '23567836',
  },
  {
    id: 3,
    studentNumber: '12345678',
    date: '2024-04-03',
    description: 'Created new feature.',
    minutes: 180,
    sprint: 1,
    tags: ['frontend'],
    groupId: '23567837',
  },
  {
    id: 4,
    studentNumber: '12345678',
    date: '2024-04-04',
    description: 'Refactored code.',
    minutes: 90,
    sprint: 2,
    tags: ['frontend', 'backend'],
    groupId: '23567837',
  },
  {
    id: 5,
    studentNumber: '12345678',
    date: '2024-04-05',
    description: 'Wrote unit tests.',
    minutes: 150,
    sprint: 3,
    tags: ['testing'],
    groupId: '23567838',
  },
]

const TimeLogsPage = () => {
  const [allLogs, setAllLogs] = useState(undefined)
  const [sprintNumber, setSprintNumber] = useState(1) // TODO: determine current sprint.

  useEffect(() => {
    // TODO: Fetch data here.
    const fetchedData = [...exampleData]
    setAllLogs(fetchedData)
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

const mapStateToProps = (state) => {}

const mapDispatchToProps = {}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeLogsPage)
)
