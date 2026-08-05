import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

const ConfirmationDialog = (props) => {
  const { title, children, open, setOpen, onConfirm } = props
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="confirmation-dialog">
      <DialogTitle id="confirmation-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          id="confirmation-dialog-no-button"
          variant="contained"
          onClick={() => setOpen(false)}
          color="secondary"
        >
          No
        </Button>
        <Button
          id="confirmation-dialog-yes-button"
          variant="contained"
          onClick={() => {
            setOpen(false)
            onConfirm()
          }}
          color="default"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
