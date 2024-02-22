import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import sprintService from '../../services/sprints'
import './SprintsDashboard.css'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const SprintsPage = ({ studentNumber }) => {
  const [allSprints, setAllSprints] = useState([])
  const [sprintNumber, setSprintNumber] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')


  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const fetchedData = await sprintService.getSprints()
        setAllSprints(fetchedData)
      } catch (error) {
        console.error('Error fetching sprints:', error)
      }
    }

    fetchSprints()
  }, [])

  const handleAddSprint = async () => {
    const sprint = {
      start_date: startDate,
      end_date: endDate,
      sprint: parseInt(sprintNumber, 10),
      user_id: studentNumber,
    }

    try {
      const updatedSprints = await sprintService.createSprint(sprint)
      setAllSprints(updatedSprints)
    } catch (error) {
      console.error('Error creating sprint:', error)
    }
  }

  const handleDeleteSprint = async (sprintId) => {
    try {
      const updatedSprints = await sprintService.deleteSprint(sprintId)
      setAllSprints(updatedSprints)
    } catch (error) {
      console.error('Error deleting sprint:', error)
    }
  }

  return (
    <div className="sprints-container">
      <Typography variant="h4">Add new sprint</Typography>
      <div className="spacer"></div>
      <div className="add-sprint-container">
        <TextField
          label="Sprint Number"
          type="number"
          value={sprintNumber}
          onChange={(e) => setSprintNumber(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button onClick={handleAddSprint} variant="contained" color="primary">
          Add Sprint
        </Button>
      </div>
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
          <tbody>
            {allSprints.map((sprint) => (
              <tr key={sprint.id}>
                <td>{sprint.sprint}</td>
                <td>{sprint.start_date}</td>
                <td>{sprint.end_date}</td>
                <td>
                  <Button
                    onClick={() => handleDeleteSprint(sprint.id)}
                    variant="contained"
                    color="secondary">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  studentNumber: state.user.user.student_number,
})

export default withRouter(connect(mapStateToProps)(SprintsPage))
