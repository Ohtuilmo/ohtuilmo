import React, { useEffect, useState } from 'react'

import { TimeLogsSelectForm } from './TimeLogsSelectForm'

import { withRouter } from 'react-router-dom'

import userService from '../../services/user'
import groupManagementService from '../../services/groupManagement'

const InstructorTimeLogsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [allStudents, setAllStudents] = useState([])
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

      fetchAllStudents()
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
    console.log(selectedGroup)
  }, [selectedStudent])

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
   </div>
  )
}

export default withRouter(
  (InstructorTimeLogsPage)
)
