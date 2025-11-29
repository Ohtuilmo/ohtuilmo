import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'

export const SprintsSelectForm = ({
  configurations, selectedConfiguration, handleConfigurationChange,
  groups, selectedGroup, handleGroupChange }) => {

  const SelectorWrapper = ({ label, children }) => (
    <div style={{ padding: 20 }}>
      <Typography variant="caption">{label}</Typography>
      {children}
    </div>
  )

  const ConfigurationSelect = ({
    configurations,
    selectedConfiguration,
    handleConfigurationChange,
    handleGroupChange,
  }) => {
    return (
      <Select
        data-cy="configuration-selector"
        value={selectedConfiguration}
        onChange={(e) => {
          handleConfigurationChange(e.target.value)
          handleGroupChange(null)
        }}
        MenuProps={{ style: { zIndex: 1600 } }}
      >
        {configurations.map((configuration) => (
          <MenuItem
            key={configuration.id}
            className="configuration-menu-item"
            value={configuration}
          >
            {configuration.name}
          </MenuItem>
        ))}
      </Select>
    )}

  const GroupIsInConfiguration = ( group, configuration ) => {
    return group.configurationId === configuration.id
  }

  const GroupSelect = ({
    groups,
    selectedGroup,
    handleGroupChange
  }) => {
    return (
      <Select
        data-cy="group-selector"
        value={selectedGroup}
        onChange={(e) => { handleGroupChange(e.target.value) }}
        MenuProps={{ style: { zIndex: 1600 } }}
      >
        {groups.filter(group => GroupIsInConfiguration(group, selectedConfiguration))
          .map((group) => (
            <MenuItem
              key={group.id}
              className="group-menu-item"
              value={group}
            >
              {group.name}
            </MenuItem>
          ))}
      </Select>
    )}

  return (
    <div className="timelog-select-container">
      <div className="selector-container">
        <SelectorWrapper label="Select configuration">
          <ConfigurationSelect
            configurations={configurations}
            selectedConfiguration={selectedConfiguration}
            handleConfigurationChange={handleConfigurationChange}
            handleGroupChange={handleGroupChange}
          />
        </SelectorWrapper>
        {selectedConfiguration &&
          <SelectorWrapper label="Select group">
            <GroupSelect
              selectedGroup={selectedGroup}
              handleGroupChange={handleGroupChange}
              groups={groups}
            />
          </SelectorWrapper>
        }
      </div>
    </div>
  )
}
