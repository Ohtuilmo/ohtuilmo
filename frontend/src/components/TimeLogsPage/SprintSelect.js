import React from 'react'
import { IconButton, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import './TimeLogsPage.css'

export const SprintSelect = ({
  sprintNumber,
  handleClickNextSprint,
  handleClickPreviousSprint,
}) => {
  return (
    <div className="timelogs-sprint-select">
      <IconButton
        disableRipple
        onClick={handleClickPreviousSprint}
        className="button"
      >
        <ArrowBackIosIcon style={{ fontSize: '16px' }} />
      </IconButton>
      <Typography variant="button">SPRINT {sprintNumber}</Typography>
      <IconButton
        disableRipple
        onClick={handleClickNextSprint}
        className="button"
      >
        <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
      </IconButton>
    </div>
  )
}
