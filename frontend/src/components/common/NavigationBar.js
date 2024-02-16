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




const NavigationBar = ({ user, history, logout }) => {
  const getAppropriateMenuItemList = () => {
    if (user === null) {
      return { items: regularItems(history) }
    }

    if (user.user.admin) {
      return {
        items: [
          { title: 'Student', items: loggedInItems(history) },
          { title: 'Instructor', items: instructorItems(history) },
          { title: 'Admin', items: adminItems(history) }
        ]
      }
    } else if (user.user.instructor) {
      return {
        items: [
          { title: 'Instructor', items: instructorItems(history) }
        ]
      }
    } else {
      return {
        items: [
          { title: 'Student', items: loggedInItems(history) }
        ]
      }
    }
  }


  let loggedIn = user && user.user ? <AccountCircle /> : ''
  let username = user && user.user ? <h4 className="navigation-bar-username tracking-in-expand">{user.user.username}</h4> : ''

  return (
    <div className="navigation-bar-container">
      <AppBar position="static">
        <Toolbar>
          <NavigationMenu menuItems={getAppropriateMenuItemList()} />
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
            onClick={logout}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.login.user
  }
}

const ConnectedNavigationBar = connect(mapStateToProps)(NavigationBar)

export default withRouter(ConnectedNavigationBar)
