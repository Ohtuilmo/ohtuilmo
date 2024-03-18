import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core'

import './TimeLogsPage.css'

export const TimeLogForm = ({ handleSubmit, disabled }) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')

  const handleDateChange = (event) => {
    setDate(event.target.value)
  }

  const handleTimeChange = (event) => {
    setTime(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    handleSubmit(date, time, description)
    clearForm()
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
