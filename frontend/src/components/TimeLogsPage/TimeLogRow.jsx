import React, { useState } from 'react'
import { minutesToFormattedHoursAndMinutes } from '../../utils/functions'
import { DeleteOutlineRounded } from '@material-ui/icons'
import { IconButton, Chip } from '@material-ui/core'
import ConfirmationDialog from '../common/ConfirmationDialog'
import Button from '@material-ui/core/Button'

import './TimeLogsPage.css'

export const TimeLogRow = ({ log, handleDelete, handleMoveToPreviousSprint, handleMoveToNextSprint }) => {
  const { hours, minutes } = minutesToFormattedHoursAndMinutes(log.minutes)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [previousMoveConfirmOpen, setPreviousMoveConfirmOpen] = useState(false)
  const [nextMoveConfirmOpen, setNextMoveConfirmOpen] = useState(false)

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
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <DeleteOutlineRounded />
        </IconButton>
        <ConfirmationDialog
          title="Delete Time Log?"
          open={deleteConfirmOpen}
          setOpen={setDeleteConfirmOpen}
          onConfirm={handleDelete}
        >
          Delete this time log? It cannot be restored.
        </ConfirmationDialog>
        <Button
          id={`timelog-move-button-previous-${log.id}`}
          className="timelogs-move-button-previous"
          style={{ padding: '0 12px' }}
          disableRipple
          onClick={() => setPreviousMoveConfirmOpen(true)}
        >
          Move to previous sprint
        </Button>
        <ConfirmationDialog
          title="Move Time Log to previous sprint?"
          open={previousMoveConfirmOpen}
          setOpen={setPreviousMoveConfirmOpen}
          onConfirm={handleMoveToPreviousSprint}
        >
          Move this time log to previos sprint?
        </ConfirmationDialog>
        <Button
          id={`timelog-move-button-next-${log.id}`}
          className="timelogs-move-button-next"
          style={{ padding: '0 12px' }}
          disableRipple
          onClick={() => setNextMoveConfirmOpen(true)}
        >
          Move to next sprint
        </Button>
        <ConfirmationDialog
          title="Move Time Log to next sprint?"
          open={nextMoveConfirmOpen}
          setOpen={setNextMoveConfirmOpen}
          onConfirm={handleMoveToNextSprint}
        >
          Move this time log to next sprint?
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
