import React from 'react'
import { connect } from 'react-redux'

import Paper from '@material-ui/core/Paper'

import * as notificationActions from '../../reducers/actions/notificationActions'
import groupManagementActions from '../../reducers/actions/groupManagementActions'

import GroupViewer from './GroupViewer'

const GroupManagementForm = ({
  groups,
  groupConfigurationID,
  deleteFromGroupAction,
  topics,
  users,
  deleteGroup,
  setSuccess,
  setError
}) => {
  const filteredGroups = groups.filter(
    (group) => group.configurationId === groupConfigurationID
  )

  return (
    <div>
      {filteredGroups.map((group) => {
        return (
          <div
            key={group.id}
            style={{ clear: 'both', display: 'table', padding: '15px' }}
          >
            <Paper>
              <table>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'top', padding: '25px' }}>
                      <GroupViewer
                        group={group}
                        topics={topics}
                        users={users}
                        deleteFromGroupAction={deleteFromGroupAction}
                        deleteGroup={deleteGroup}
                        setSuccess={setSuccess}
                        setError={setError}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToPropsForm = (state) => ({
  groupConfigurationID: state.groupPage.groupConfigurationID,
  groups: state.groupPage.groups,
  topics: state.topicListPage.topics,
  users: state.groupPage.users
})

const mapDispatchToPropsForm = {
  deleteFromGroupAction: groupManagementActions.deleteFromGroup,
  deleteGroup: groupManagementActions.deleteGroup,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess
}

export default connect(
  mapStateToPropsForm,
  mapDispatchToPropsForm
)(GroupManagementForm)
