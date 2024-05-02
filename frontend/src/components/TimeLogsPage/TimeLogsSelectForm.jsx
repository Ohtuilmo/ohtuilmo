import React from 'react'
import './TimeLogsPage.css'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'

export const TimeLogsSelectForm = ({
  configurations, selectedConfiguration, handleConfigurationChange,
  groups, selectedGroup, handleGroupChange,
  students, selectedStudentNumber, handleStudentNumberChange }) => {

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
    handleStudentNumberChange
  }) => {
    return (
      <Select
        data-cy="configuration-selector"
        value={selectedConfiguration}
        onChange={(e) => {
          handleConfigurationChange(e.target.value)
          handleGroupChange(null)
          handleStudentNumberChange(null)
        }}
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
        onChange={(e) => {
          handleGroupChange(e.target.value)
          handleStudentNumberChange(null)
        }}
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

  const StudentIsInGroup = ( student, group ) => {
    return group.studentIds.includes(student.student_number)
  }

  const StudentSelect = ({
    selectedGroup,
    students,
    selectedStudentNumber,
    handleStudentNumberChange
  }) => {
    return (
      <Select
        data-cy="student-selector"
        value={selectedStudentNumber}
        onChange={(e) => {
          handleStudentNumberChange(e.target.value)
        }}
        disabled={!selectedGroup}
      >
        {students.filter(student => StudentIsInGroup(student, selectedGroup))
          .map((student) => (
            <MenuItem
              key={student.student_number}
              className="student-menu-item"
              value={student.student_number}
            >
              {student.first_names} {student.last_name}
            </MenuItem>
          ))}
      </Select>
    )
  }

  return (
    <div className="timelog-select-container">
      <div className="selector-container">
        <SelectorWrapper label="Select configuration">
          <ConfigurationSelect
            configurations={configurations}
            selectedConfiguration={selectedConfiguration}
            handleConfigurationChange={handleConfigurationChange}
            handleGroupChange={handleGroupChange}
            handleStudentNumberChange={handleStudentNumberChange}
          />
        </SelectorWrapper>
        {selectedConfiguration &&
          <SelectorWrapper label="Select group">
            <GroupSelect
              selectedGroup={selectedGroup}
              handleGroupChange={handleGroupChange}
              groups={groups}
              handleStudentNumberChange={handleStudentNumberChange}
            />
          </SelectorWrapper>
        }
        {selectedGroup &&
          <SelectorWrapper label="Select student">
            <StudentSelect
              selectedGroup={selectedGroup}
              selectedStudentNumber={selectedStudentNumber}
              handleStudentNumberChange={handleStudentNumberChange}
              students={students}
            />
          </SelectorWrapper>
        }
      </div>
    </div>
  )
}
