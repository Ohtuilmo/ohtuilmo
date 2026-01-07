import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateRole } from "../../services/dev"
import * as userActions from '../../reducers/actions/userActions'
import myGroupActions from '../../reducers/actions/myGroupActions'
import registrationmanagementActions from '../../reducers/actions/registrationManagementActions'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import AccountCircle from '@material-ui/icons/AccountCircle'
import GroupIcon from '@material-ui/icons/Group'
import NavigationMenu from './NavigationMenu'
import {
  regularItems,
  loggedInItems,
  adminItems,
  instructorItems,
  loggedInUnregisteredItems
} from './MenuItemLists'
import './NavigationBar.css'

const NavigationBar = ({ group, user, loginUser, initializeMyGroup, fetchRegistrationManagement, history, logout }) => {
  const getAppropriateMenuItemList = () => {
    if (user === null) {
      return { items: regularItems(history) }
    }

    if (user.user.admin) {
      return {
        items: [
          { title: 'Admin', items: adminItems(history) },
          { title: 'Instructor', items: instructorItems(history) },
          { title: 'Student', items: loggedInItems(history) },
          { title: 'Student - no group', items: loggedInUnregisteredItems(history) }
        ],
      }
    } else if (user.user.instructor) {
      return {
        items: [
          { title: 'Instructor', items: instructorItems(history) },
          { title: 'Student', items: loggedInItems(history) },
          { title: 'Student - no group', items: loggedInUnregisteredItems(history) }
        ],
      }
    } else if (group) {
      return {
        items: [{ title: 'Student', items: loggedInItems(history) }],
      }
    } else {
      return [{ title: 'Student - no group', items: loggedInUnregisteredItems(history) }]
    }
  }

  let groupname =
    group && group.groupName ? (
      <h4
        className="navigation-bar-groupname tracking-in-expand"
        data-cy="groupname_display_assigned"
      >
        {group.groupName}
      </h4>
    ) : (
      <h4
        className="navigation-bar-groupname tracking-in-expand"
        data-cy="groupname_display_unassigned"
      >
        No group assigned
      </h4>
    )
  let username =
    user && user.user ? (
      <h4 className="navigation-bar-username tracking-in-expand">
        {user.user.username}
      </h4>
    ) : (
      ''
    )

  let loggedIn =
    user && user.user ? (
      <Fragment>
        {!user.user.admin && !user.user.instructor ? (
          <GroupIcon className="navigation-bar-groupicon" />
        ) : (
          ''
        )}
        {!user.user.admin && !user.user.instructor ? groupname : ''}
        <AccountCircle />
        {username}
      </Fragment>
    ) : (
      ''
    )

  const handleClick = async (role) => {
    try {
      console.log("New role:", await updateRole(role))
      await loginUser()
      await initializeMyGroup()
      await fetchRegistrationManagement()
    } catch (e) {
      console.error("Failed to update role:", e)
    }
  }

  let select_role =
    import.meta.env.MODE === "development"
      ? (
        <div style={{ marginRight: "10px"}}>
          <Button variant="outlined" onClick={async () => await handleClick("student")}>
            Student
          </Button>
          <Button variant="outlined" onClick={async () => await handleClick("instructor")}>
            Instructor
          </Button>
          <Button variant="outlined" onClick={async () => await handleClick("admin")}>
            Admin
          </Button>
        </div>
      )
      : ""

  return (
    <div className="navigation-bar-container">
      <AppBar position="static">
        <Toolbar style={{ zIndex: 1500 }}>
          <NavigationMenu menuItems={getAppropriateMenuItemList()} />
          <Typography
            variant="h6"
            color="inherit"
            className="navigation-bar-title"
            style={{ marginLeft: '9px' }}
          >
            Software engineering project
          </Typography>
          {select_role}
          {loggedIn}
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
    user: state.login.user,
    group: state.registrationDetails.myGroup,
  }
}

const mapDispatchToProps = {
  loginUser: userActions.loginUser,
  initializeMyGroup: myGroupActions.initializeMyGroup,
  fetchRegistrationManagement: registrationmanagementActions.fetchRegistrationManagement,
}

const ConnectedNavigationBar = connect(mapStateToProps, mapDispatchToProps)(NavigationBar)

export default withRouter(ConnectedNavigationBar)
