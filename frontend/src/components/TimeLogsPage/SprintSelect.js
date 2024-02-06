import React from 'react'
import { Grid, IconButton, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import './TimeLogsPage.css'

export const SprintSelect = ({
  sprintNumber,
  handleClickNextSprint,
  handleClickPreviousSprint,
}) => {
  return (
    <Grid container alignItems="center">
      <IconButton onClick={handleClickPreviousSprint}>
        <ArrowBackIosIcon style={{ fontSize: '16px' }} />
      </IconButton>
      <Typography variant="button">SPRINT {sprintNumber}</Typography>
      <IconButton onClick={handleClickNextSprint}>
        <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
      </IconButton>
    </Grid>
  )
}
