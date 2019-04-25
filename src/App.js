import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch, Redirect, Link } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import './App.css'

// Components
import ConfigurationPage from './components/ConfigurationPage'
import LoginPage from './components/LoginPage'
import LandingPage from './components/LandingPage'
import TopicFormPage from './components/TopicFormPage'
import TopicListPage from './components/TopicListPage'
import ViewTopicPage from './components/ViewTopicPage'
import RegistrationPage from './components/RegistrationPage'
import ParticipantsPage from './components/ParticipantsPage'
import NavigationBar from './components/common/NavigationBar'
import Notification from './components/common/Notification'
import LoadingSpinner from './components/common/LoadingSpinner'
import RegistrationQuestionsPage from './components/RegistrationQuestionsPage'
import PeerReviewQuestionsPage from './components/PeerReviewQuestionsPage'
import CustomerReviewQuestionsPage from './components/CustomerReviewQuestionsPage'
import RegistrationManagementPage from './components/RegistrationManagementPage'
import RegistrationDetailsPage from './components/RegistrationDetailsPage'
import GroupManagementPage from './components/GroupManagementPage'
import PeerReviewPage from './components/PeerReviewPage'
import EmailTemplatesPage from './components/EmailTemplatesPage'
import InstructorPage from './components/InstructorPage'
import CustomerReviewPage from './components/CustomerReviewPage'
import InstructorReviewPage from './components/InstructorReviewPage'

// Actions
import appActions from './reducers/actions/appActions'
import * as notificationActions from './reducers/actions/notificationActions'
import loginPageActions from './reducers/actions/loginPageActions'
import registrationmanagementActions from './reducers/actions/registrationManagementActions'
import registrationActions from './reducers/actions/registrationActions'
import peerReviewPageActions from './reducers/actions/peerReviewPageActions'
import * as userActions from './reducers/actions/userActions'

// Protected routes
import {
  AdminRoute,
  LoginRoute,
  InstructorRoute
} from '../src/utils/protectedRoutes'

const history = createBrowserHistory({ basename: process.env.PUBLIC_URL })

const NotFound = () => (
  <div className="not-found-page">
    <h1>Page not found</h1>
    <Link data-cy="return-link" to="/">
      Return to the home page
    </Link>
  </div>
)

class App extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  componentWillMount() {
    this.fetchRegistrationManagement()

    if (this.props.user) {
      this.props.updateIsLoading(true)
      this.props.checkToken(this.props.user)
      this.props.updateIsLoading(false)
    }
  }

  fetchRegistrationManagement = async () => {
    try {
      await this.props.fetchRegistrationManagement()
    } catch (e) {
      console.log('error happened', e)
      this.props.setError(
        'Error fetching registration management configuration',
        5000
      )
    }
  }

  logout() {
    this.props.updateIsLoading(true)
    this.props.logoutUser()
    this.props.clearRegistrations()
    this.props.updateIsLoading(false)
    history.push('/login')
  }

  render() {
    let loadingSpinner
    if (this.props.isLoading) {
      loadingSpinner = <LoadingSpinner />
    }

    return (
      <Router history={history}>
        <div id="app-wrapper">
          <NavigationBar logout={this.logout} />
          <Notification />
          <div id="app-content">
            {loadingSpinner}
            <Switch>
              <Route
                path="/login"
                render={() =>
                  this.props.user ? (
                    this.props.user.instructor ? (
                      <Redirect to="/instructorpage" />
                    ) : (
                      <Redirect to="/" />
                    )
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <LoginRoute exact path="/" render={() => <LandingPage />} />
              <AdminRoute
                exact
                path="/topics"
                render={() => <TopicListPage />}
              />
              <Route
                exact
                path="/topics/create"
                render={() => <TopicFormPage />}
              />
              <Route
                exact
                path="/topics/:id"
                render={(props) => <ViewTopicPage {...props} />}
              />
              <AdminRoute
                exact
                path="/administration/configuration"
                render={() => <ConfigurationPage />}
              />
              <AdminRoute
                exact
                path="/administration/participants"
                render={() => <ParticipantsPage />}
              />
              <AdminRoute
                exact
                path="/administration/customer-review-questions"
                render={() => <CustomerReviewQuestionsPage />}
              />
              <AdminRoute
                exact
                path="/administration/peer-review-questions"
                render={() => <PeerReviewQuestionsPage />}
              />
              <AdminRoute
                exact
                path="/administration/registration-questions"
                render={() => <RegistrationQuestionsPage />}
              />
              <AdminRoute
                exact
                path="/administration/groups"
                render={() => <GroupManagementPage />}
              />
              <AdminRoute
                exact
                path="/administration/email-templates"
                render={() => <EmailTemplatesPage />}
              />
              <Route
                exact
                path="/customer-review/:id"
                render={(props) => <CustomerReviewPage {...props} />}
              />
              <LoginRoute
                exact
                path="/register"
                user={this.props.user}
                render={() => <RegistrationPage />}
              />
              <LoginRoute
                exact
                path="/peerreview"
                user={this.props.user}
                render={() => <PeerReviewPage />}
              />
              <AdminRoute
                exact
                path="/administration/registrationmanagement"
                render={() => <RegistrationManagementPage />}
              />
              <InstructorRoute
                exact
                path="/instructorpage"
                render={() => <InstructorPage />}
              />
              <InstructorRoute
                exact
                path="/instructorreviewpage"
                render={() => <InstructorReviewPage />}
              />

              <LoginRoute
                exact
                path="/registrationdetails"
                render={() => <RegistrationDetailsPage />}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.app.isLoading,
    user: state.user
  }
}

const mapDispatchToProps = {
  setError: notificationActions.setError,
  ...loginPageActions,
  ...appActions,
  fetchRegistrationManagement:
    registrationmanagementActions.fetchRegistrationManagement,
  clearRegistrations: registrationActions.clearRegistrations,
  ...peerReviewPageActions,
  loginUser: userActions.loginUser,
  logoutUser: userActions.logoutUser,
  checkToken: userActions.checkToken
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ConnectedApp
