import React, { useState } from 'react'
import { AddCircleOutlineOutlined } from '@material-ui/icons'
import { Grid } from '@material-ui/core'

import {
  FormControl,
  InputLabel,
  Input,
  TextField,
  IconButton,
} from '@material-ui/core'

import './TimeLogsPage.css'

export const TimeLogForm = ({ handleSubmit }) => {
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
      <Grid container>
        <Grid item xs={2}>
          <FormControl>
            <InputLabel htmlFor="date">Date (YYYY-MM-DD)</InputLabel>
            <Input
              id="date"
              aria-describedby="date"
              value={date}
              onChange={handleDateChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl>
            <InputLabel htmlFor="time">Time (HH:MM)</InputLabel>
            <Input
              id="time"
              aria-describedby="time"
              value={time}
              onChange={handleTimeChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="description"
            label="Description"
            multiline
            value={description}
            onChange={handleDescriptionChange}
          />
        </Grid>
        <Grid item xs={2}>
          <IconButton type="submit">
            <AddCircleOutlineOutlined />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  )
}
