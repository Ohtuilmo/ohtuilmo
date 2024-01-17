import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import appActions from '../reducers/actions/appActions'
import loginPageActions from '../reducers/actions/loginPageActions'
import * as notificationActions from '../reducers/actions/notificationActions'
import * as userActions from '../reducers/actions/userActions'
import './LoginPage.css'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.login = this.login.bind(this)
  }

  login = async (event) => {
    this.props.updateIsLoading(true)
    event.preventDefault()
    let username = this.props.username
    let password = this.props.password

    try {
      await this.props.loginUser({ username, password })
      this.props.setSuccess('Login successful!', 3000)
      this.props.clearForm()
      this.props.updateIsLoading(false)
    } catch (e) {
      console.log('error happened', e.response)
      this.props.updateIsLoading(false)

      if (e.response) {
        if (e.response.status === 400) {
          this.props.setError('Username or password is missing!', 3000)
        } else if (e.response.status === 401) {
          this.props.setError('Username or password is incorrect!', 3000)
        }
      } else {
        this.props.setError('Error occurred, login failed', 3000)
      }
    }
  }

  render() {
    return (
      <div className="loginpage-container">
        <h1 className="loginpage-header">Login</h1>
        <p className="loginpage-information">
          University of Helsinki account required for login.
        </p>
        <form onSubmit={this.login} className="loginpage-form">
          <div>
            <TextField
              className="username-field"
              error={this.props.username.length > 20 ? true : false}
              type="text"
              name="username"
              label="Username"
              value={this.props.username}
              onChange={(e) => this.props.updateUsername(e.target.value)}
            />
          </div>
          <div>
            <TextField
              className="password-field"
              error={this.props.password.length > 20 ? true : false}
              type="password"
              name="password"
              label="Password"
              value={this.props.password}
              onChange={(e) => this.props.updatePassword(e.target.value)}
            />
          </div>
          <Button
            className="loginpage-button"
            style={{ marginTop: '30px' }}
            variant="outlined"
            color="default"
            type="submit"
          >
            Log in
          </Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.loginPage.username,
    password: state.loginPage.password,
    isLoading: state.app.isLoading
  }
}

const mapDispatchToProps = {
  ...loginPageActions,
  ...appActions,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  loginUser: userActions.loginUser
}

const ConnectedLoginPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)

export default ConnectedLoginPage
