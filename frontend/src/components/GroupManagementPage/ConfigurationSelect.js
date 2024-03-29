import React from 'react'
import { connect } from 'react-redux'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

import groupManagementActions from '../../reducers/actions/groupManagementActions'

const ConfigurationSelect = ({
  groupConfigurationID,
  onConfigurationChange,
  configurations,
}) => {
  return (
    <Select
      className="configuration-selector"
      value={groupConfigurationID}
      onChange={(e) => onConfigurationChange(e.target.value)}
    >
      {configurations.map((configuration) => (
        <MenuItem
          key={configuration.id}
          value={configuration.id}
          className={`configuration-${configuration.id}`}
          data-cy="configuration"
        >
          {configuration.name}
        </MenuItem>
      ))}
    </Select>
  )
}

const mapStateToPropsForm = (state) => {
  const defaultConfiguration =
    state.configurationPage.configurations.length > 0
      ? state.configurationPage.configurations[0].id
      : ''

  return {
    groupConfigurationID:
      state.groupPage.groupConfigurationID || defaultConfiguration,
    configurations: state.configurationPage.configurations,
  }
}

const mapDispatchToPropsForm = {
  onConfigurationChange: groupManagementActions.updateGroupConfigurationID,
}

export default connect(
  mapStateToPropsForm,
  mapDispatchToPropsForm
)(ConfigurationSelect)
