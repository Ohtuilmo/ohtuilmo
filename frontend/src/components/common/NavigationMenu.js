import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import MenuIcon from '@material-ui/icons/Menu'
import './NavigationBar.css'

class NavigationMenu extends React.Component {
  state = {
    open: false,
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

    const menuItemsArray = Array.isArray(this.props.menuItems)
      ? this.props.menuItems
      : this.props.menuItems.items

    const renderMenuItems = (items) => {
      return items.map((item) => {
        if (item.items) {
          return (
            <React.Fragment key={item.title}>
              <MenuItem disabled>{item.title}</MenuItem>
              {renderMenuItems(item.items)} {}
            </React.Fragment>
          )
        } else {
          return (
            <MenuItem
              className={item.className}
              onClick={() => this.handleItemClick(item)}
              key={item.text}
            >
              {item.text}
            </MenuItem>
          )
        }
      })
    }

    return (
      <div className="navigation-menu">
        <div>
          <IconButton
            id="hamburger-menu-button"
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
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    {menuItemsArray.map((group, index) =>
                      group.title ? (
                        <React.Fragment key={`group-${index}`}>
                          <MenuList>
                            <MenuItem disabled>{group.title}</MenuItem>
                            {renderMenuItems(group.items)}
                          </MenuList>
                        </React.Fragment>
                      ) : (
                        renderMenuItems(group)
                      )
                    )}
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
