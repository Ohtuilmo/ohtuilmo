import React, { useState, useEffect, useImperativeHandle } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import sprintService from '../../services/sprints'

export const SprintListItem = (props) => {
  const { sprint, setError, setSuccess } = props

  const [isEditing, setIsEditing] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")
  const [startDateErrorMessage, setStartDateErrorMessage] = useState("")
  const [endDateErrorMessage, setEndDateErrorMessage] = useState("")

  const formatDate = (date) => {
    const dateObj = new Date(date)

    const formattedDate = dateObj.toLocaleDateString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\./g, '/')

    return formattedDate
  }

  useEffect(() => {
    if (sprint) {
      setStartDate(sprint.start_date)
      setEndDate(sprint.end_date)

      setNewStartDate(sprint.start_date)
      setNewEndDate(sprint.end_date)
    }
  }, [sprint])


  const handleEditButtonClick = () => {
    // Editing -> Cancel -> Reset back to normal
    if (isEditing) {
      setNewStartDate(startDate)
      setNewEndDate(endDate)

      setStartDateErrorMessage("")
      setEndDateErrorMessage("")
    }

    setIsEditing(!isEditing)
  }

  const validDates = () => {
    // NOTE: This checks only for correctness of dates with respect to only itself.
    // Dates can still be invalid compared to other sprint's dates
    // This happens through the backend
    let valid = true
    if (new Date(newStartDate) > new Date(newEndDate)) {
      setStartDateErrorMessage("Start date is higher than end date.")
      setEndDateErrorMessage("End date is lower than start date.")
      setError("Start date is higher than end date.")
      valid = false
    }
    return valid
  }

  const handleUpdate = async () => {
    if (validDates()) {
      setStartDateErrorMessage("")
      setEndDateErrorMessage("")

      try {
        const res = await sprintService.updateSprint({ 
          id: sprint.id,
          start_date: newStartDate, 
          end_date: newEndDate,
          sprint: sprint.sprint
        })

        setSuccess(res.message)
        setStartDate(newStartDate)
        setEndDate(newEndDate)
        setIsEditing(false)
      } catch (error) {
        console.error(error.response?.data?.error)
        setError(error.response?.data?.error, 15*1000)
      }
    }
  }


  return (
    <tr>
      <td className="sprint-list-sprint-number">{sprint.sprint}</td>
      <td>{!isEditing ? formatDate(startDate) : 
        <TextField
          errors={(!!startDateErrorMessage).toString()}
          helperText={startDateErrorMessage}
          className="date"
          id="date"
          type="date"
          label="Date"
          aria-describedby="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      }</td>
      <td>{!isEditing ? formatDate(endDate) : 
        <TextField
          errors={(!!endDateErrorMessage).toString()}
          helperText={endDateErrorMessage}
          className="date"
          id="date"
          type="date"
          label="Date"
          aria-describedby="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      }</td>
      <td>
        {isEditing &&
          <Button
            id={`sprint-edit-save-button-${sprint.id}`}
            onClick={handleUpdate}
            className="submit-sprint-button"
            variant="contained"
            color="secondary"
          >
          Save
          </Button>
        }
        <Button
          id={`sprint-edit-button-${sprint.id}`}
          onClick={handleEditButtonClick}
          className="edit-sprint-button"
          variant="contained"
          color="secondary"
        >
        {isEditing ? "Cancel" : "Edit" }
        </Button>
      </td>
    </tr>
  )
}
