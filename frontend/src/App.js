import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch, Link } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import './App.css'

// Components
import ConfigurationPage from './components/ConfigurationPage'
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
import ViewCustomerReviewsPage from './components/ViewCustomerReviewsPage'
import Registrations from './components/Registrations'
import InstructorReviews from './components/InstructorReviews'

// Actions
import appActions from './reducers/actions/appActions'
import * as notificationActions from './reducers/actions/notificationActions'
import loginPageActions from './reducers/actions/loginPageActions'
import configurationPageActions from './reducers/actions/configurationPageActions'
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

import loginService from './services/login'

const history = createBrowserHistory({ basename: process.env.PUBLIC_URL })

const NotFound = () => (
  <div className="not-found-page">
    <h1>Page not found</h1>
    <Link data-cy="return-link" to="/">
      Return to the home page
    </Link>
  </div>
)

const App = (props) => {
  useEffect(() => {
    //props.updateIsLoading(true)
    console.log(window.location.href)
    if (!window.location.href.includes('customer-review/')){
      props.loginUser()
    }

    fetchRegistrationManagement()
    fetchConfigurations()
    props.updateIsLoading(false)
    setInterval(() => {
      console.log('timeout')
      if (!window.location.href.includes('customer-review/')){
        loginService.login()
      }
    }, 60 * 1000)
  }, [])

  const fetchConfigurations = async () => {
    try {
      await props.fetchConfigurations()
    } catch (e) {
      console.log('error happened', e)
      props.setError('Error fetching configurations', 5000)
    }
  }

  const fetchRegistrationManagement = async () => {
    try {
      await props.fetchRegistrationManagement()
    } catch (e) {
      console.log('error happened', e)
      props.setError(
        'Error fetching registration management configuration',
        5000
      )
    }
  }

  const logout = () => {
    props.updateIsLoading(true)
    props.logoutUser()
    props.clearRegistrations()
    props.updateIsLoading(false)
  }

  return (
    <Router history={history}>
      <div id="app-wrapper">
        <NavigationBar logout={logout} />
        <Notification />
        <div id="app-content">
          {props.isLoading ? <LoadingSpinner /> : null}
          <Switch>
            <Route path="/login" render={() => null} />
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
            <AdminRoute
              exact
              path="/administration/registrations"
              render={() => <Registrations />}
            />
            <AdminRoute
              exact
              path="/administration/reviews"
              render={() => <InstructorReviews />}
            />
            <Route
              exact
              path="/customer-review/:id"
              render={(props) => <CustomerReviewPage {...props} />}
            />
            <LoginRoute
              exact
              path="/register"
              user={props.user}
              render={() => <RegistrationPage />}
            />
            <LoginRoute
              exact
              path="/peerreview"
              user={props.user}
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
            <InstructorRoute
              path="/adminstration/customer-reviews"
              render={() => <ViewCustomerReviewsPage />}
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
  fetchConfigurations:
    configurationPageActions.fetchConfigurations,
  fetchRegistrationManagement:
    registrationmanagementActions.fetchRegistrationManagement,
  clearRegistrations: registrationActions.clearRegistrations,
  ...peerReviewPageActions,
  logoutUser: userActions.logoutUser,
  loginUser: userActions.loginUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
