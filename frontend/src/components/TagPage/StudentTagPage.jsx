import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import LoadingSpinner from "../common/LoadingSpinner"
import {
  NotInGroupPlaceholder,
  NoSprintsPlaceholder,
} from '../common/Placeholders'

import tagService from '../../services/tags'
import sprintService from '../../services/sprints'
import * as notificationActions from '../../reducers/actions/notificationActions'

const StudentTagPage = (props) => {
  const { user, group } = props

  const [isLoading, setIsLoading] = useState(true)
  const [availableTags, setAvailableTags] = useState([])
  const [studentTags, setStudentTags] = useState([])
  const [allSprints, setAllSprints] = useState([])

  useEffect(() => {
    const fetchTagsByStudent = async () => {
      try {
        const studentTags = await tagService.getTagsByStudent(user.studentNumber)
        setStudentTags(studentTags)
        console.log('student tags:', studentTags)
      } catch (error) {
        console.error(
          'Error fetching student tags:',
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
        console.log('all sprints:', fetchedData)
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
    const fetchTags = async () => {
      try {
        const rawTagData = await tagService.getTags()
        const availableTagData = rawTagData.map((tag) => tag.title)
        setAvailableTags(availableTagData)
        console.log('available tags:', availableTagData)
      } catch (error) {
        console.error(
          'Error fetching tags:',
          error.message,
          ' / ',
          error.response.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchData = async () => {
      setIsLoading(true)
      group?.id && await fetchSprints()
      await fetchTagsByStudent()
      await fetchTags()
      setIsLoading(false)
    }

    fetchData()
  }, [setStudentTags])

  if (isLoading) return <LoadingSpinner />
  if (!group) return <NotInGroupPlaceholder />
  if (allSprints.length === 0) return <NoSprintsPlaceholder />

  return (
    <div>
      <h2>Student Tag Page (Debug View)</h2>

      <section>
        <h3>Available Tags</h3>
        {availableTags.length === 0 ? (
          <p>No available tags found.</p>
        ) : (
          <ul>
            {availableTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Student Tags</h3>
        {Object.keys(studentTags).length === 0 ? (
          <p>No student tag data found.</p>
        ) : (
          <div>
            {Object.entries(studentTags).map(([tag, entries]) => (
              <div key={tag}>
                <strong>{tag}</strong>
                <ul>
                  {entries.map((entry, index) => (
                    <li key={index}>
                      Sprint {entry.sprint_id}: {entry.minutes} min
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3>All Sprints</h3>
        {allSprints.length === 0 ? (
          <p>No sprints found.</p>
        ) : (
          <ul>
            {allSprints.map((sprint) => (
              <li key={sprint.id}>
                Sprint {sprint.sprint}: {sprint.start_date} – {sprint.end_date}
              </li>
            ))}
          </ul>
        )}
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
    name: `${state.login.user.user.first_name} ${state.login.user.user.last_name}`
  },
  group: state.registrationDetails.myGroup,
})

const mapDispatchToProps = {
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StudentTagPage)
)

