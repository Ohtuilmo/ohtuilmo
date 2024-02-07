import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import groupManagementService from '../../services/groupManagement'
import userService from '../../services/user'

import topicListPageActions from '../../reducers/actions/topicListPageActions'
import * as notificationActions from '../../reducers/actions/notificationActions'
import groupManagementActions from '../../reducers/actions/groupManagementActions'
import configurationPageActions from '../../reducers/actions/configurationPageActions'

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
  const { setUsers, setGroups, fetchTopics, setConfigurations, setError, fetchConfigurations } =
    props

  useEffect(() => {
    fetchConfigurations()
    const fetchData = async () => {
      try {
        const fetchedGroups = await groupManagementService.get()
        const fetchedUsers = await userService.get()

        setUsers(fetchedUsers)
        setGroups(fetchedGroups)
        await fetchTopics()
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
  setGroups: groupManagementActions.setGroups,
  setUsers: groupManagementActions.setUsers,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchTopics: topicListPageActions.fetchTopics,
  fetchConfigurations: configurationPageActions.fetchConfigurations,
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupManagementPage)
