import React from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'

class UserDetails extends React.Component {
  render() {
    var firstname = this.props.user ? this.props.user.user.first_names : ''
    if (firstname.includes('*'))
      firstname = firstname.split('*')[1].split(' ')[0]
    else firstname = firstname.split(' ')[0]

    return (
      <div>
        <Typography variant="h6" id="title">
          Name: {firstname}{' '}
          {this.props.user ? this.props.user.user.last_name : null}
        </Typography>
        <Typography variant="h6" id="title">
          Student number:{' '}
          {this.props.user ? this.props.user.user.student_number : null}
        </Typography>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const ConnectedUserDetails = connect(mapStateToProps)(UserDetails)

export default ConnectedUserDetails
