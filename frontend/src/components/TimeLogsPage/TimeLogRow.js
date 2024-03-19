import React from 'react'
import { minutesToFormattedHoursAndMinutes } from '../../utils/functions'
import { DeleteOutlineRounded } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'

import './TimeLogsPage.css'

export const TimeLogRow = ({ log, handleDelete }) => {
  const { hours, minutes } = minutesToFormattedHoursAndMinutes(log.minutes)

  return (
    <div className="timelogs-table-row">
      <div className="timelogs-date-and-time">
        <p>
          {hours}:{minutes}
        </p>
        <p>{log.date}</p>
      </div>
      <div className="timelogs-description">
        <p>{log.description}</p>
      </div>
      <IconButton
        id={`timelog-remove-button-${log.id}`}
        className="timelogs-remove-button"
        style={{ padding: '0 12px' }}
        disableRipple
        onClick={handleDelete}
      >
        <DeleteOutlineRounded />
      </IconButton>
    </div>
  )
}
