import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { TimeLogForm } from './TimeLogForm'
import { TimeLogRow } from './TimeLogRow'
import TimeLogChart from './TimeLogChart'
import {
  NotInGroupPlaceholder,
  NoSprintsPlaceholder,
} from '../common/Placeholders'
import LoadingSpinner from '../common/LoadingSpinner'
import { SprintSelect } from './SprintSelect'
import { Typography } from '@material-ui/core'

// hooks
import useCheckMobileView from '../../hooks/useCheckMobileView'

// services
import timeLogsService from '../../services/timeLogs'
import sprintService from '../../services/sprints'

// actions
import myGroupActions from '../../reducers/actions/myGroupActions'
import {
  minutesAndHoursFromString,
  hoursAndMinutesToMinutes
} from '../../utils/functions'
import './TimeLogsPage.css'
import * as notificationActions from '../../reducers/actions/notificationActions'
import timeLogsActions from '../../reducers/actions/timeLogsActions'

const TimeLogsPage = (props) => {
  const {
    currentSprintNumber,
    selectedSprintNumber,
    setCurrentSprintNumber,
    setSelectedSprintNumber,
    setGroupSprintSummary,
    user,
    group,
    initializeMyGroup
  } = props
  const [allLogs, setAllLogs] = useState([])
  const [allSprints, setAllSprints] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const isMobileView = useCheckMobileView()

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
        const logs = await timeLogsService.getTimeLogs()
        setAllLogs(logs)
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
    const fetchGroupSprintSummary = async (id) => {
      try {
        const summaryData = await timeLogsService.getGroupSprintSummary(id)
        setGroupSprintSummary(JSON.parse(summaryData))
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
    const fetchData = async () => {
      setIsLoading(true)
      await fetchGroup()
      group && group.id && await fetchSprints()
      await fetchTimeLogs()
      group && group.id && await fetchGroupSprintSummary(group.id)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const today = new Date()
    const currentSprintObject = allSprints.find(
      (sprint) => {
        const start = new Date(sprint.start_date)
        const end = new Date(sprint.end_date)

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        return today >= start && today <= end
      }
    )

    currentSprintObject && setCurrentSprintNumber(currentSprintObject.sprint)
    currentSprintObject && setSelectedSprintNumber(currentSprintObject.sprint)
    !currentSprintObject &&
      setSelectedSprintNumber(
        existingSprintNumbers.length > 0 ? existingSprintNumbers.at(-1) : null
      )
  }, [allSprints])

  const handleSubmit = async (date, time, description) => {
    const log = {
      studentNumber: user.studentNumber,
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
      [...existingSprintNumbers]
        .reverse()
        .find((sprint) => sprint < selectedSprintNumber) || selectedSprintNumber
    )
  }

  const isLogs = (logs) => logs && logs.length > 0

  const logsBySprint =
    isLogs(allLogs) &&
    allLogs.filter((log) => log.sprint === selectedSprintNumber)

  if (isLoading) return <LoadingSpinner />
  if (!group) return <NotInGroupPlaceholder />
  if (allSprints.length === 0) return <NoSprintsPlaceholder />

  if (isMobileView) {
    return (
      <div className='timelogs-container-1'>
        <div className='timelogs-container-2'>
          <div className='timelogs-container-3'>
            <Typography variant='h4'>Time Logs</Typography>
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
        <div id='timelog-rows'>
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
        <div className='timelogs-container-chart' style={{
          marginTop: '1rem'
        }}>
          <Typography variant='h5'>Sprint</Typography>
          <TimeLogChart chartVariant='sprint' mobileView={isMobileView} />
          <Typography variant='h5'>Project</Typography>
          <TimeLogChart chartVariant='total'  mobileView={isMobileView} />
        </div>
      </div>
    )
  } else {
    return (
      <div className='timelogs-container-4'>
        <div className='timelogs-container-1'>
          <div className='timelogs-container-2'>
            <div className='timelogs-container-3'>
              <Typography variant='h4'>Time Logs</Typography>
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
          <div id='timelog-rows'>
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
        <div className='timelogs-container-chart'>
          <Typography variant='h5'>Sprint</Typography>
          <TimeLogChart chartVariant='sprint' />
          <Typography variant='h5'>Project</Typography>
          <TimeLogChart chartVariant='total' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  state: state,
  user: {
    studentNumber: state.login.user.user.student_number,
    admin: state.login.user.user.admin,
    instructor: state.login.user.user.instructor,
    name: `${state.login.user.user.first_name} ${state.login.user.user.last_name}`
  },
  currentSprintNumber: state.timeLogs.currentSprintNumber,
  selectedSprintNumber: state.timeLogs.selectedSprintNumber,
  group: state.registrationDetails.myGroup,
})

const mapDispatchToProps = {
  initializeMyGroup: myGroupActions.initializeMyGroup,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  setCurrentSprintNumber: timeLogsActions.setCurrentSprintNumber,
  setSelectedSprintNumber: timeLogsActions.setSelectedSprintNumber,
  setGroupSprintSummary: timeLogsActions.setGroupSprintSummary,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeLogsPage)
)
