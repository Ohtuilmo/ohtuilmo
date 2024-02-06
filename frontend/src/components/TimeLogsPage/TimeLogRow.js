import React from 'react'
import { minutesToFormattedHoursAndMinutes } from '../../utils/functions'
import { DeleteOutlineRounded } from '@material-ui/icons'
import { Grid, IconButton } from '@material-ui/core'

import './TimeLogsPage.css'

export const TimeLogRow = ({ log, handleDelete }) => {
  const { hours, minutes } = minutesToFormattedHoursAndMinutes(log.minutes)

  return (
    <Grid container>
      <Grid item xs={2}>
        <p>{log.date}</p>
      </Grid>
      <Grid item xs={2}>
        <p>{hours}:{minutes}</p>
      </Grid>
      <Grid item xs={2}>
        <p>{log.description}</p>
      </Grid>
      <Grid item xs={2}>
        <IconButton onClick={handleDelete}>
          <DeleteOutlineRounded />
        </IconButton>
      </Grid>
    </Grid>
  )
}
