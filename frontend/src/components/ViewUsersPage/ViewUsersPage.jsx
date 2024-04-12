import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import * as userListActions from '../../reducers/actions/userListActions'

const customTheme = createMuiTheme({
  typography: {
    overline: {
      color: 'darkOrange',
    },
  },
  link: {
    color: 'darkOrange',
  },
})

const TopicDetailsLink = ({ topicId, ...props }) => (
  <Link {...props} to={`/topics/${topicId}`} />
)

const AdminMarker = () => {
  return (
    <MuiThemeProvider theme={customTheme}>
      <Typography variant="overline">Currently admin</Typography>
    </MuiThemeProvider>
  )
}

const LinkedCell = (props) => {
  if (props.instructor) {
    return (
      <TableCell padding="dense">
        {props.instructor.map((group, index) => {
          return (
            <TopicDetailsLink key={'instructor' + index} topicId={group.topic}>
              {group.semester}: {group.groupName}
            </TopicDetailsLink>
          )
        })}
      </TableCell>
    )
  } else {
    return (
      <TableCell padding="dense">
        {props.participated.map((group, index) => {
          return (
            <TopicDetailsLink
              key={'participated' + index}
              topicId={group.topic}
            >
              {group.semester}: {group.groupName}
            </TopicDetailsLink>
          )
        })}
      </TableCell>
    )
  }
}

const UserTableBody = (props) => {
  const { users } = props
  if (!users || users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell padding="dense" colSpan={4}>
            <Typography variant="overline">No users found</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
  return (
    <TableBody>
      {users.map((user) => {
        return (
          <TableRow key={user.username}>
            <TableCell padding="dense">
              <Typography variant="body2">
                {user.last_name} {user.first_names}
                <br />
                {user.student_number}
              </Typography>
              {user.admin && (
                <React.Fragment>
                  <br />
                  <AdminMarker />
                </React.Fragment>
              )}
            </TableCell>
            <TableCell padding="dense">
              <Typography variant="body2">{user.email}</Typography>
            </TableCell>
            {user.participated && user.participated.length > 0 ? (
              <LinkedCell participated={user.participated} />
            ) : (
              <TableCell padding="dense">
                <Typography variant="overline">
                  No course participation
                </Typography>
              </TableCell>
            )}
            {user.instructor && user.instructor.length > 0 ? (
              <LinkedCell instructor={user.instructor} />
            ) : (
              <TableCell padding="dense">
                <Typography variant="overline">
                  No instructor activities
                </Typography>
              </TableCell>
            )}
          </TableRow>
        )
      })}
    </TableBody>
  )
}

const UserTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="dense">Name & student number</TableCell>
        <TableCell padding="dense">Email</TableCell>
        <TableCell padding="dense">Participated</TableCell>
        <TableCell padding="dense">Instructed</TableCell>
      </TableRow>
    </TableHead>
  )
}

const UserTable = (props) => {
  return (
    <Table>
      <UserTableHead />
      <UserTableBody users={props.users} />
    </Table>
  )
}

const ViewUsersPage = (props) => {
  useEffect(() => {
    props.setUsers()
  }, [])
  return (
    <div>
      <UserTable users={props.users} />
    </div>
  )
}

const mapStateToProps = (state) => {
  const { login, users } = state
  return {
    user: login.user.user,
    users: users.users,
  }
}

const mapDispatchToProps = {
  setUsers: userListActions.setUsers,
  resetUsers: userListActions.resetUsers,
  setTestUsers: userListActions.setTestUsers,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewUsersPage)
)
