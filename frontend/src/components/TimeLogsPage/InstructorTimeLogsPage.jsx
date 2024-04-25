import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import { TimeLogsSelectForm } from './TimeLogsSelectForm'
import { TimeLogRow } from './TimeLogRow'

import userService from '../../services/user'
import groupManagementService from '../../services/groupManagement'
import timeLogsService from '../../services/timeLogs'

const InstructorTimeLogsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [allLogs, setAllLogs] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
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
        await fetchAllStudents()
        await fetchAllLogs()
      }
      fetchData()
    }, [])

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const group = await groupManagementService.getByStudent(selectedStudent)
        setSelectedGroup(group)
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

    fetchGroup()
  }, [selectedStudent])

  const isLogs = (logs) => logs && logs.length > 0
  const logsByStudent =
    isLogs(allLogs) && allLogs.filter((log) => log.studentNumber === selectedStudent)

  return (
    <div>
      <div>
        <TimeLogsSelectForm
          students={allStudents}
          selectedStudent={selectedStudent}
          handleStudentChange={setSelectedStudent}
        />
        <div>{selectedStudent}</div>
        {selectedGroup && <div>{selectedGroup.groupName}</div>}
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
