import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import { TimeLogsSelectForm } from './TimeLogsSelectForm'
import { TimeLogRow } from './TimeLogRow'
import LoadingSpinner from '../common/LoadingSpinner'

import userService from '../../services/user'
import groupManagementService from '../../services/groupManagement'
import timeLogsService from '../../services/timeLogs'

const InstructorTimeLogsPage = () => {
  const [allGroups, setAllGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null)
  const [allLogs, setAllLogs] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
          const allLogs = await timeLogsService.getTimeLogs()
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
        await fetchAllGroups()
        await fetchAllStudents()
        await fetchAllLogs()
        setIsLoading(false)
      }
      fetchData()
    }, [])

  const isLogs = (logs) => logs && logs.length > 0
  const logsByStudent =
    isLogs(allLogs) && allLogs.filter((log) => log.studentNumber === selectedStudentNumber)

  if (isLoading) return <LoadingSpinner />
  return (
    <div>
      <div>
        <TimeLogsSelectForm
          groups={allGroups}
          selectedGroup={selectedGroup}
          handleGroupChange={setSelectedGroup}
          students={allStudents}
          selectedStudentNumber={selectedStudentNumber}
          handleStudentNumberChange={setSelectedStudentNumber}
        />
        {selectedGroup && <div>{selectedGroup.name}</div>}
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
          <p>No logs yet :&#40;</p>
        )}
      </div>
   </div>
  )
}

export default withRouter(
  (InstructorTimeLogsPage)
)
