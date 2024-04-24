import React from 'react'
import { IconButton, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

import './TimeLogsPage.css'

export const SprintSelect = ({
  sprintNumber,
  handleClickNextSprint,
  handleClickPreviousSprint,
  nextSprintButtonDisabled,
  previousSprintButtonDisabled,
}) => {
  if (sprintNumber === undefined) {
    return <></>
  } else {
    return (
      <div className="timelogs-sprint-select">
        <IconButton
          id="previous-sprint-button"
          disableRipple
          onClick={handleClickPreviousSprint}
          className="button"
          disabled={previousSprintButtonDisabled}
        >
          <ArrowBackIosIcon
            style={
              previousSprintButtonDisabled
                ? { fontSize: '16px', color: 'transparent' }
                : { fontSize: '16px' }
            }
          />
        </IconButton>
        <Typography variant="button">SPRINT {sprintNumber}</Typography>
        <IconButton
          id="next-sprint-button"
          disableRipple
          onClick={handleClickNextSprint}
          className="button"
          disabled={nextSprintButtonDisabled}
        >
          <ArrowForwardIosIcon
            style={
              nextSprintButtonDisabled
                ? { fontSize: '16px', color: 'transparent' }
                : { fontSize: '16px' }
            }
          />
        </IconButton>
      </div>
    )
  }
}
