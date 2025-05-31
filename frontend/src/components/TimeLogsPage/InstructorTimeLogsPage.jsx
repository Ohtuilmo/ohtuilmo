import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { TimeLogsSelectForm } from './TimeLogsSelectForm'
import { TimeLogRow } from './TimeLogRow'
import TimeLogChart from './TimeLogChart'
import LoadingSpinner from '../common/LoadingSpinner'
import { SprintSelect } from './SprintSelect'

import { Typography } from '@material-ui/core'

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
      const newestGroupByInstructor = allGroups.findLast(
        group => group.instructor === user.user.id
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
  const logsByStudent =
    isLogs(allLogs) && allLogs.filter((log) => log.studentNumber === selectedStudentNumber)

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
          {isLogs(logsByStudent) &&
            logsByStudent.map((log) => (
              <TimeLogRow
                key={log.id}
                log={log}
              />
            ))}
          {!isLogs(logsByStudent) && (
            <p>No logs by the selected user.</p>
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
