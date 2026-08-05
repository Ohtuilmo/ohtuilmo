import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import './QuestionSetItem.css'

const ItemControls = ({ onEditClicked }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const withClose = (fn) => () => {
    handleClose()
    fn()
  }

  return (
    <>
      <IconButton
        className="question-set-item-controls__menu-button"
        aria-owns={anchorEl && 'question-set-item-controls__menu'}
        aria-haspopup={true}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="question-set-item-controls__menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
      >
        <MenuItem
          className="question-set-item-controls__edit-button"
          onClick={withClose(onEditClicked)}
        >
          Edit
        </MenuItem>
      </Menu>
    </>
  )
}

ItemControls.propTypes = {
  onEditClicked: PropTypes.func,
}

const QuestionSetItem = ({ title, children, onEditClicked }) => {
  const theme = useTheme()
  const headerStyle = {
    borderColor: theme.palette.primary.main,
  }

  return (
    <div className="question-set-item">
      <Paper elevation={2} className="question-set-item__header" style={headerStyle}>
        <h3 className="question-set-item__title">{title}</h3>
        <div className="question-set-item__controls">
          <ItemControls onEditClicked={onEditClicked} />
        </div>
      </Paper>
      <div className="question-set-item__content">
        <Paper elevation={1}>{children}</Paper>
      </div>
    </div>
  )
}

QuestionSetItem.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onEditClicked: PropTypes.func,
}

export default QuestionSetItem
