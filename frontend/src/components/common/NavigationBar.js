import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AccountCircle from '@material-ui/icons/AccountCircle'
import NavigationMenu from './NavigationMenu'
import {
  regularItems,
  loggedInItems,
  adminItems,
  instructorItems
} from './MenuItemLists'
import './NavigationBar.css'

class NavigationBar extends React.Component {
  getAppropriateMenuItemList() {
    if (this.props.user === null) {
      return regularItems(this.props.history)
    }
    const user = this.props.user.user

    if (user.admin) {
      return adminItems(this.props.history)
    }
    if (user.instructor) {
      return instructorItems(this.props.history)
    }
    return loggedInItems(this.props.history)
  }

  render() {
    let loggedIn
    let username
    if (this.props.user) {
      loggedIn = <AccountCircle />
      username = (
        <h4 className="navigation-bar-username tracking-in-expand">
          {this.props.user.user.username}
        </h4>
      )
    } else {
      loggedIn = ''
    }

    return (
      <div className="navigation-bar-container">
        <AppBar position="static">
          <Toolbar>
            <NavigationMenu menuItems={this.getAppropriateMenuItemList()} />
            <Typography
              variant="h6"
              color="inherit"
              className="grow"
              style={{ marginLeft: '9px' }}
            >
              Software engineering project
            </Typography>
            {loggedIn}
            {username}
            <Button
              className="navigation-bar-logout-button"
              style={{ marginLeft: '10px' }}
              variant="outlined"
              onClick={this.props.logout}
            >
              Log out
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedNavigationBar = connect(mapStateToProps)(NavigationBar)

export default withRouter(ConnectedNavigationBar)
