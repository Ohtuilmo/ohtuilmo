import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import configurationService from '../../services/configuration'
import groupManagementService from '../../services/groupManagement'
import userService from '../../services/user'

import topicListPageActions from '../../reducers/actions/topicListPageActions'
import configurationPageActions from '../../reducers/actions/configurationPageActions'
import * as notificationActions from '../../reducers/actions/notificationActions'
import groupManagementActions from '../../reducers/actions/groupManagementActions'

import GroupManagementForm from './GroupManagementForm'
import ConfigurationSelect from './ConfigurationSelect'
import GroupCreationForm from './GroupCreationForm'

const ConfigurationSelectWrapper = ({ label, children }) => (
  <div style={{ padding: 20 }}>
    <Typography variant="caption">{label}</Typography>
    {children}
  </div>
)

const GroupManagementPage = (props) => {
  const { setUsers, setGroups, fetchTopics, setConfigurations, setError } =
    props

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedConfiguration = await configurationService.getAll()
        const fetchedGroups = await groupManagementService.get()
        const fetchedUsers = await userService.get()

        setUsers(fetchedUsers)
        setGroups(fetchedGroups)
        await fetchTopics()
        setConfigurations(fetchedConfiguration.configurations.reverse())
      } catch (err) {
        setError('Some error happened')
      }
    }

    fetchData()
  }, [setUsers, setGroups, fetchTopics, setConfigurations, setError])

  return (
    <div>
      <h2>Administration</h2>
      <h3>Group Management</h3>

      <ConfigurationSelectWrapper label="Select configuration">
        <ConfigurationSelect props={props} />
      </ConfigurationSelectWrapper>

      <Paper elevation={2} style={{ padding: '1rem 1.5rem' }}>
        <h4>Create group</h4>
        <GroupCreationForm />
      </Paper>

      <p />

      <h4>Created groups</h4>

      <GroupManagementForm />
    </div>
  )
}
const mapStateToProps = (state) => ({
  topics: state.topicListPage.topics,
  configurations: state.configurationPage.configurations,
  groups: state.groupPage.groups,
  users: state.groupPage.users,
})

const mapDispatchToProps = {
  updateTopics: topicListPageActions.updateTopics,
  setConfigurations: configurationPageActions.setConfigurations,
  setGroups: groupManagementActions.setGroups,
  setUsers: groupManagementActions.setUsers,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchTopics: topicListPageActions.fetchTopics,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupManagementPage)
