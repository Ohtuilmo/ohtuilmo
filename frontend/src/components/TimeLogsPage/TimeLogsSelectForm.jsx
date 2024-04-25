import './TimeLogsPage.css'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'

export const TimeLogsSelectForm = ({ students, handleStudentChange }) => {
  const StudentSelectWrapper = ({ label, children }) => (
    <div style={{ padding: 20 }}>
      <Typography variant="caption">{label}</Typography>
      {children}
    </div>
  )
  
  const StudentSelect = ({
    students,
    currentStudent,
    handleStudentChange
  }) => {
    return (
      <Select
        data-cy="student-selector"
        value={currentStudent}
        onChange={(e) => {
          handleStudentChange(e.target.value)
        }}
      >
        {students.map((student) => (
          <MenuItem
            key={student.student_number}
            className="student-menu-item"
            value={student.student_number}
          >
            {student.first_names}
          </MenuItem>
        ))}
      </Select>
    )
  }

  return (
    <div className="timelog-select-container">
      <div className="selector-container">
        <StudentSelectWrapper label="Select student">
          <StudentSelect
            currentStudent={currentStudent}
            handleStudentChange={handleStudentChange}
            students={students}
          />
        </StudentSelectWrapper>
      </div>
    </div>
  )
}
