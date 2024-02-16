
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

import LoadingCover from '../common/LoadingCover'
import * as userListActions from '../../reducers/actions/userListActions'

const customTheme = createMuiTheme({
  typography: {
    overline: {
      color: 'darkOrange',
    }
  }
})

const AdminMarker = () => {
  return <MuiThemeProvider theme={customTheme}>
    <Typography variant="overline" >Currently admin</Typography>
  </MuiThemeProvider>
}

const InstructorCell = (props) => {
  return <TableCell padding="dense">
    {props.instructor.map((group, index) => {
      return <Typography variant='body2' key={'instructor'+index}>
        {group.semester}: {group.groupName}
      </Typography>
    })}
  </TableCell>
}

const ParticipationCell = (props) => {
  const { participated } = props
  return participated.length === 1
    ? <TableCell padding="dense">
      <Typography variant='body2' >
        {participated[0].semester}: {participated[0].groupName}
      </Typography>
    </TableCell>
    : <TableCell padding="dense">
      {participated.map((group, index) => {
        return <Typography variant='body2' key={'participated'+index}>
          {group.semester}: {group.groupName}
        </Typography>
      })}
    </TableCell>
}

const UserTableBody = (props) => {
  const { users } = props
  if (!users || users.length === 0) {
    return <TableBody>
      <TableRow>
        <TableCell padding="dense" colSpan={4}><Typography variant='overline' >No users found</Typography></TableCell>
      </TableRow>
    </TableBody>
  }
  return <TableBody>
    {users.map((user) => {
      return <TableRow key={user.username}>
        <TableCell padding="dense">
          <Typography variant='body2' >{user.last_name} {user.first_names}<br />{user.student_number}</Typography>
          {user.admin && <React.Fragment><br/><AdminMarker /></React.Fragment>}
        </TableCell>
        <TableCell padding="dense"><Typography variant='body2' >{user.email}</Typography></TableCell>
        {user.participated && user.participated.length > 0
          ? <ParticipationCell participated={user.participated} />
          : <TableCell padding="dense"><Typography variant='overline' >No course participation</Typography></TableCell>}
        {user.instructor && user.instructor.length > 0
          ? <InstructorCell instructor={user.instructor} />
          : <TableCell padding="dense"><Typography variant='overline' >No instructor activities</Typography></TableCell>}
      </TableRow>
    })}
  </TableBody>
}

const UserTableHead = () => {
  return <TableHead>
    <TableRow>
      <TableCell padding="dense">Name & student number</TableCell>
      <TableCell padding="dense">Email</TableCell>
      <TableCell padding="dense">Participated</TableCell>
      <TableCell padding="dense">Instructed</TableCell>
    </TableRow>
  </TableHead>
}

const UserTable = (props) => {
  return <Table>
    <UserTableHead />
    <UserTableBody users={props.users} />
  </Table>
}

const ViewUsersPage = (props) => {
  useEffect(() => {
    props.setUsers()
  }, [])
  return <div>
    {props.isLoading && <LoadingCover className="users-container__loading-cover" />}
    <UserTable users={props.users} />
  </div>
}

const mapStateToProps = (state) => {
  const { login, app, users } = state
  return {
    user: login.user.user,
    isLoading: app.isLoading,
    users: users.users
  }
}

const mapDispatchToProps = {
  setUsers: userListActions.setUsers,
  resetUsers: userListActions.resetUsers,
  setTestUsers: userListActions.setTestUsers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewUsersPage)
