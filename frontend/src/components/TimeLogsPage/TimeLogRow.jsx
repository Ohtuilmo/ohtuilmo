import React, { useState } from 'react'
import { minutesToFormattedHoursAndMinutes } from '../../utils/functions'
import { DeleteOutlineRounded } from '@material-ui/icons'
import { IconButton, Chip } from '@material-ui/core'
import ConfirmationDialog from '../common/ConfirmationDialog'

import './TimeLogsPage.css'

export const TimeLogRow = ({ log, handleDelete }) => {
  const { hours, minutes } = minutesToFormattedHoursAndMinutes(log.minutes)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const dateObj = new Date(log.date)
  const formattedDate = dateObj.toLocaleDateString('fi-FI', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\./g, '/')

  return (
    <div className="timelogs-row-container">
      <div className="timelogs-table-row">
        <div className="timelogs-date-and-time">
          <p>
            {hours}:{minutes}
          </p>
          <p>{formattedDate}</p>
        </div>
        <div className="timelogs-description">
          <p>{log.description}</p>
        </div>
        <IconButton
          id={`timelog-remove-button-${log.id}`}
          className="timelogs-remove-button"
          style={{ padding: '0 12px' }}
          disableRipple
          onClick={() => setConfirmOpen(true)}
        >
          <DeleteOutlineRounded />
        </IconButton>
        <ConfirmationDialog
          title="Delete Time Log?"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={handleDelete}
        >
          Delete this time log? It cannot be restored.
        </ConfirmationDialog>
      </div>
      <div className="timelogs-tags-row">
        {log.tags.map((tag) => (
          <Chip key={tag} label={tag} className="timelogs-tag" size="small" />
        ))}
      </div>
    </div>
  )
}
