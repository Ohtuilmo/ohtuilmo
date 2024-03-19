import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'

import './TimeLogsPage.css'

export const TimeLogForm = ({ handleSubmit, disabled }) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [formTimeHasError, setFormTimeHasError] = useState(false)
  const [timeErrorMessage, setTimeErrorMessage] = useState('')
  const [formDescriptionHasError, setFormDescriptionHasError] = useState(false)
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('')

  const handleDateChange = (event) => {
    setDate(event.target.value)
  }

  const handleTimeChange = (event) => {
    setTime(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const formIsInvalid = () => {
    let error_exists = false
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    if (!timePattern.test(time)) {
      setFormTimeHasError(true)
      setTimeErrorMessage('Time must be in format HH:MM')
      error_exists = true
    }
    if (description.length < 5) {
      setFormDescriptionHasError(true)
      setDescriptionErrorMessage('Description must be at least 5 characters')
      error_exists = true
    }
    return error_exists
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (formIsInvalid()) {
      return
    } else {
      setFormTimeHasError(false)
      setTimeErrorMessage('')
      setFormDescriptionHasError(false)
      setDescriptionErrorMessage('')
      handleSubmit(date, time, description)
      clearForm()
    }
  }

  const clearForm = () => {
    setDate(new Date().toISOString().slice(0, 10))
    setTime('')
    setDescription('')
  }

  return (
    <form onSubmit={handleFormSubmit} className="timelogs-form">
      <div className="input-container">
        <TextField
          disabled={disabled}
          className="date"
          id="date"
          type="date"
          label="Date"
          aria-describedby="date"
          value={date}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          disabled={disabled}
          error={formTimeHasError}
          helperText={formTimeHasError && timeErrorMessage}
          className="time"
          id="time"
          label="Time (HH:MM)"
          aria-describedby="time"
          value={time}
          onChange={handleTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          disabled={disabled}
          error={formDescriptionHasError}
          helperText={formDescriptionHasError && descriptionErrorMessage}
          className="description"
          id="description"
          label="Description"
          multiline
          value={description}
          onChange={handleDescriptionChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
      </div>
      <Button
        id="time-log-submit-button"
        disabled={disabled}
        type="submit"
        variant="contained"
        className="submit-button"
        style={{
          backgroundColor: !disabled ? '#188433' : 'transparent',
          color: 'white',
          borderRadius: '8px',
          boxShadow: 'none',
          fontWeight: 'bolder',
        }}
      >
        Add Entry
      </Button>
    </form>
  )
}
