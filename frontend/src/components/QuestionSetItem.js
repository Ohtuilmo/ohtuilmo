import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { withTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreVertIcon from '@material-ui/icons/MoreVert'
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
  onEditClicked: PropTypes.func
}

const QuestionSetItem = ({ title, children, onEditClicked, theme }) => {
  const headerStyle = {
    borderColor: theme.palette.primary.main
  }

  return (
    <div className="question-set-item">
      <Paper
        elevation={2}
        className="question-set-item__header"
        style={headerStyle}
      >
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
  theme: PropTypes.object
}

export default withTheme()(QuestionSetItem)
