import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import MenuIcon from '@material-ui/icons/Menu'

class NavigationMenu extends React.Component {
  state = {
    open: false
  }

  handleToggle = () => {
    this.setState({ open: !this.state.open })
  }

  handleClose = (event) => {
    if (this.anchorEl.contains(event.target)) {
      return
    }

    this.setState({ open: false })
  }

  handleItemClick = (item) => {
    this.setState({ open: false })
    item.handler()
  }

  render() {
    const { open } = this.state

    return (
      <div>
        <div>
          <IconButton
            className="nav-menu-button"
            buttonRef={(node) => {
              this.anchorEl = node
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            <MenuIcon />
          </IconButton>
          <Popper
            style={{ zIndex: 1 }}
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {this.props.menuItems.map((item) => (
                        <MenuItem
                          className={item.className}
                          onClick={() => this.handleItemClick(item)}
                          key={item.text}
                        >
                          {item.text}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    )
  }
}

export default NavigationMenu
