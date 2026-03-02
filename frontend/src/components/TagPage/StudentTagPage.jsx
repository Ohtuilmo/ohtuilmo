import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  NotInGroupPlaceholder,
  NoSprintsPlaceholder,
} from '../common/Placeholders'
import CheckboxMultiSelect from '../common/CheckboxMultiSelect'
import TagUsageSummaryChart from './TagUsageSummaryChart'

import sprintService from '../../services/sprints'
import * as notificationActions from '../../reducers/actions/notificationActions'
import tagsActions from '../../reducers/actions/tagActions'

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
      setSelectedTags(availableTags)
      setIsLoading(false)
    }

    fetchData()
  }, [fetchAvailableTags, fetchTagsByStudent, user.studentNumber, group?.id])

  if (isLoading) return <LoadingSpinner />
  if (!group) return <NotInGroupPlaceholder />
  if (allSprints.length === 0) return <NoSprintsPlaceholder />

  return (
    <div>
      <section>
        <TagUsageSummaryChart
          allSprints={allSprints}
          availableTags={selectedTags}
          tagData={studentTags}
        />
      </section>

      <section>
        <CheckboxMultiSelect
          allItems={availableTags}
          selectedItems={selectedTags}
          setSelectedItems={setSelectedTags}
        />
      </section>
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
