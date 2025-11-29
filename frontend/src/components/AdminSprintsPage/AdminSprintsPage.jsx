import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import LoadingSpinner from '../common/LoadingSpinner'
import { SprintsSelectForm } from "./SprintsSelectForm"
import { SprintListItem } from "./SprintListItem"

import { Typography } from '@material-ui/core'

import sprintService from '../../services/sprints'
import configurationService from '../../services/configuration'
import groupManagementService from '../../services/groupManagement'

import * as notificationActions from '../../reducers/actions/notificationActions'


const AdminSprintsPage = (props) => {
  const {
    setError,
    setSuccess
  } = props

  const [allConfigurations, setAllConfigurations] = useState([])
  const [allGroups, setAllGroups] = useState([])
  const [allSprints, setAllSprints] = useState([])
  const [selectedConfiguration, setSelectedConfiguration] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)

  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    // TODO set newest configuration by default
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
    const fetchData = async () => {
      setIsLoading(true)
      await fetchAllConfigurations()
      await fetchAllGroups()
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchSprints = async (group_id) => {
      try {
        const sprintData = await sprintService.getSprintsByGroup(group_id);
        setAllSprints(sprintData);
      } catch (error) {
        console.error(
          'Error fetching all sprints:',
          error.message,
          ' / ',
          error.message.data.error
        )
        notificationActions.setError(error.response.data.error)
      }
    }
    const fetchData = async (selectedGroupId) => {
      setIsLoading(true)
      await fetchSprints(selectedGroupId)
      setIsLoading(false)
    }
    selectedGroup?.id && fetchData(selectedGroup.id)
  }, [selectedGroup, selectedConfiguration])



  if (isLoading) return <LoadingSpinner />

  return (
  <div>
    <SprintsSelectForm
      configurations={allConfigurations}
      selectedConfiguration={selectedConfiguration}
      handleConfigurationChange={setSelectedConfiguration}
      groups={allGroups}
      selectedGroup={selectedGroup}
      handleGroupChange={setSelectedGroup}
    />
    {selectedGroup && (
      <div>
        <Typography variant='h5'>Sprints by {selectedGroup.name}</Typography>
      {allSprints.length > 0 && (
        <div className="sprint-list-container">
          <table>
            <thead>
              <tr>
                <th>Sprint Number</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="sprint-list-rows">
              {allSprints.sort((a, b) => b.sprint - a.sprint).map((sprint) => {
                return <SprintListItem sprint={sprint} setError={setError} setSuccess={setSuccess}/>
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>
    )}
  </div>
  )
}

const mapStateToProps = (state) => ({
  state: state,
  user: state.login.user,
})

const mapDispatchToProps = {
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
}


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminSprintsPage)
)
