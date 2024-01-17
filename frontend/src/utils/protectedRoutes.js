import React from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const Unauthorized = () => (
  <div className="unauthorized-page">
    <h1>Unauthorized.</h1>
    <Link data-cy="return-link" to="/">
      Return to the home page
    </Link>
  </div>
)

export const AdminRoute = connect(mapStateToProps)(
  ({ render: Component, user, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return user.user.admin ? <Component {...props} /> : <Unauthorized />
        }
        return null
      }}
    />
  )
)

export const InstructorRoute = connect(mapStateToProps)(
  ({ render: Component, user, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return user.user.instructor || user.user.admin ? (
            <Component {...props} />
          ) : (
            <Unauthorized />
          )
        }
        return null
      }}
    />
  )
)

export const LoginRoute = connect(mapStateToProps)(
  ({ render: Component, user, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        return user ? <Component {...props} /> : null
      }}
    />
  )
)
