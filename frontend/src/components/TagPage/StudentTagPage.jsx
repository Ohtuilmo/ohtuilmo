import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import { Typography } from '@material-ui/core'
import {
  NotInGroupPlaceholder,
  NoSprintsPlaceholder,
} from '../common/Placeholders'
import CheckboxMultiSelect from '../common/CheckboxMultiSelect'
import TagUsageLineChart from './TagUsageLineChart'
import TagUsageBarChart from './TagUsageBarChart'

import sprintService from '../../services/sprints'
import * as notificationActions from '../../reducers/actions/notificationActions'
import tagsActions from '../../reducers/actions/tagActions'
import './TagPage.css'

const StudentTagPage = (props) => {
  const {
    user,
    group,
    availableTags,
    studentTags,
    fetchAvailableTags,
    fetchTagsByStudent,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [allSprints, setAllSprints] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const fetchedData = await sprintService.getSprints()
        setAllSprints(fetchedData)
        console.log('all sprints:', fetchedData)
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
      group?.id && (await fetchSprints())
      await fetchTagsByStudent(user.studentNumber)
      await fetchAvailableTags()
      setIsLoading(false)
    }

    fetchData()
  }, [fetchAvailableTags, fetchTagsByStudent, user.studentNumber, group?.id])

  useEffect(() => {
    setSelectedTags(availableTags)
  }, [availableTags])

  if (isLoading) return <LoadingSpinner />
  if (!group) return <NotInGroupPlaceholder />
  if (allSprints.length === 0) return <NoSprintsPlaceholder />

  return (
    <div className="tagpage-container">
      <div className="tagpage-selection-container">
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
              availableTags={selectedTags}
              tagData={studentTags}
            />
            <TagUsageLineChart
              allSprints={allSprints}
              availableTags={selectedTags}
              tagData={studentTags}
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
  group: state.registrationDetails.myGroup,
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
  connect(mapStateToProps, mapDispatchToProps)(StudentTagPage),
)
