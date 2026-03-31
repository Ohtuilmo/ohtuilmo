import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import { Typography } from '@material-ui/core'
import CheckboxMultiSelect from '../common/CheckboxMultiSelect'
import { StudentSelectionForm } from '../common/StudentSelectionForm'
import TagUsageLineChart from './TagUsageLineChart'
import TagUsageBarChart from './TagUsageBarChart'

import configurationService from '../../services/configuration'
import groupManagementService from '../../services/groupManagement'
import sprintService from '../../services/sprints'
import userService from '../../services/user'
import * as notificationActions from '../../reducers/actions/notificationActions'
import tagsActions from '../../reducers/actions/tagActions'
import './TagPage.css'

const colourSet = [
  '#9258c8',
  '#3a75c4',
  '#8c0032',
  '#15bef0',
  '#00b08c',
  '#fca311',
  '#009e60',
  '#e5053a',
  '#5bbf21',
  '#00a39a',
  '#e63375',
  '#256ec7',
  '#e95c55',
  '#a3af07',
]

const StaffTagPage = (props) => {
  const {
    user,
    availableTags,
    studentTags,
    fetchAvailableTags,
    fetchTagsByStudent,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [allSprints, setAllSprints] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const [allConfigurations, setAllConfigurations] = useState([])
  const [selectedConfigurationId, setSelectedConfigurationId] = useState(0)
  const [allGroups, setAllGroups] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(0)

  const tagColors = availableTags.reduce((acc, tag, index) => {
    acc[tag] = colourSet[index % colourSet.length]
    return acc
  }, {})

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
        setError(error.response.data.error)
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
        setError(error.response.data.error)
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
        setError(error.response.data.error)
      }
    }

    const fetchData = async () => {
      setIsLoading(true)
      await fetchAllConfigurations()
      await fetchAllGroups()
      await fetchAllStudents()
      await fetchAvailableTags()
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (allConfigurations.length > 0 && allGroups.length > 0) {
      const allGroupsInSortedOrder = [...allGroups] // clones the array
      allGroupsInSortedOrder.sort((a, b) => a.id - b.id)
      const newestGroupByInstructor = allGroupsInSortedOrder.findLast(
        group => group.instructorId === user.studentNumber
      )
      const configurationByInstructor = allConfigurations.find(
        configuration =>
          newestGroupByInstructor?.configurationId === configuration.id
      )
      setSelectedConfigurationId(configurationByInstructor?.id ?? 0)
      setSelectedGroupId(newestGroupByInstructor?.id ?? 0)
      setSelectedGroup(newestGroupByInstructor?.id ? newestGroupByInstructor : null)
    }
  }, [allConfigurations, allGroups])

  useEffect(() => {
    if (!selectedGroupId) return
    const fetchSprints = async () => {
      try {
        const sprintData = await sprintService.getSprintsByGroup(selectedGroupId)
        setAllSprints(sprintData)
      } catch (error) {
        console.error(
          'Error fetching sprints:',
          error.message,
          ' / ',
          error.response.data.error,
        )
        notificationActions.setError(error.response.data.error)
      }
    }

    const fetchData = async () => {
      setIsLoading(true)
      selectedGroupId && (await fetchSprints())
      setIsLoading(false)
    }
    fetchData()
  }, [selectedGroupId])

  useEffect(() => {
    if (!selectedStudentNumber) return
    const fetchData = async () => {
      setIsLoading(true)
      await fetchTagsByStudent(selectedStudentNumber)
      setIsLoading(false)
    }
    fetchData()
  }, [selectedStudentNumber])

  useEffect(() => {
    setSelectedTags(availableTags)
  }, [availableTags])

  const handleConfigurationChange = (configuration_id) => {
    const configurationById = allConfigurations.find(conf => conf.id === configuration_id)
    setSelectedConfigurationId(configurationById.id ?? 0)
  }

  const handleGroupChange = (group_id) => {
    const groupById = allGroups.find(grp => grp.id === group_id)
    setSelectedGroupId(groupById?.id ?? 0)
    setSelectedGroup(groupById?.id ? groupById : null)
  }

  const handleStudentChange = async (studentNumber) => {
    setSelectedStudentNumber(studentNumber)
  }

  if (isLoading) return <LoadingSpinner />
//   if (!group) return <NotInGroupPlaceholder />
//   if (allSprints.length === 0) return <NoSprintsPlaceholder />

  return (
    <div className="tagpage-container">
      <div className="tagpage-selection-container">
        <StudentSelectionForm
          configurations={allConfigurations}
          selectedConfigurationId={selectedConfigurationId}
          handleConfigurationChange={handleConfigurationChange}
          groups={allGroups}
          selectedGroupId={selectedGroupId}
          handleGroupChange={handleGroupChange}
          students={allStudents}
          selectedStudentNumber={selectedStudentNumber}
          handleStudentNumberChange={handleStudentChange}
        />
        <Typography variant="h4">Tags</Typography>
        <CheckboxMultiSelect
          allItems={availableTags}
          selectedItems={selectedTags}
          setSelectedItems={setSelectedTags}
        />
      </div>
      <div className="tagpage-charts-container">
        {selectedTags.length === 0 ? (
          <Typography variant="body1">No tags selected.</Typography>
        ) : (
          <>
            <TagUsageBarChart
              allTags={availableTags}
              selectedTags={selectedTags}
              tagData={studentTags}
              tagColors={tagColors}
            />

            <TagUsageLineChart
              allSprints={allSprints}
              allTags={availableTags}
              selectedTags={selectedTags}
              tagData={studentTags}
              tagColors={tagColors}
            />
          </>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  state: state,
  user: {
    studentNumber: state.login.user.user.student_number,
    admin: state.login.user.user.admin,
    instructor: state.login.user.user.instructor,
    name: `${state.login.user.user.first_name} ${state.login.user.user.last_name}`,
  },
  availableTags: state.tags.availableTags,
  studentTags: state.tags.studentTags,
})

const mapDispatchToProps = {
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchAvailableTags: tagsActions.fetchAvailableTags,
  fetchTagsByStudent: tagsActions.fetchTagsByStudent,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StaffTagPage),
)
