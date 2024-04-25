import './TimeLogsPage.css'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'

export const TimeLogsSelectForm = ({
  groups, selectedGroup, handleGroupChange,
  students, selectedStudent, handleStudentChange }) => {
  const GroupSelectWrapper = ({ label, children }) => (
    <div style={{ padding: 20 }}>
      <Typography variant="caption">{label}</Typography>
      {children}
    </div>
  )

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
          handleStudentChange(null)
        }}
      >
        {groups.map((group) => (
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
  
  const StudentSelectWrapper = ({ label, children }) => (
    <div style={{ padding: 20 }}>
      <Typography variant="caption">{label}</Typography>
      {children}
    </div>
  )

  const StudentSelect = ({
    selectedGroup,
    students,
    selectedStudent,
    handleStudentChange
  }) => {
    return (
      <Select
        data-cy="student-selector"
        value={selectedStudent}
        onChange={(e) => {
          handleStudentChange(e.target.value)
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
        <GroupSelectWrapper label="Select group">
          <GroupSelect
            selectedGroup={selectedGroup}
            handleGroupChange={handleGroupChange}
            groups={groups}
            handleStudentChange={handleStudentChange}
          />
        </GroupSelectWrapper>
        {selectedGroup &&
          <StudentSelectWrapper label="Select student">
            <StudentSelect
              selectedGroup={selectedGroup}
              selectedStudent={selectedStudent}
              handleStudentChange={handleStudentChange}
              students={students}
            />
          </StudentSelectWrapper>
        }
      </div>
    </div>
  )
}
