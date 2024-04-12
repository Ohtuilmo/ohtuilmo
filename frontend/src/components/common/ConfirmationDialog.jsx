import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

const ConfirmationDialog = (props) => {
  const { title, children, open, setOpen, onConfirm } = props
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="confirmation-dialog"
    >
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
