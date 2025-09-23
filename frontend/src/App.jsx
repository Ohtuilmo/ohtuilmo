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
import InstructorPage from './components/InstructorPage/InstructorPage'
import CustomerReviewPage from './components/CustomerReviewPage'
import InstructorReviewPage from './components/InstructorReviewPage'
import ViewCustomerReviewsPage from './components/ViewCustomerReviewsPage'
import Registrations from './components/Registrations'
import InstructorReviews from './components/InstructorReviews'
import ViewUsersPage from './components/ViewUsersPage/ViewUsersPage'
import TimeLogsPage from './components/TimeLogsPage/TimeLogsPage'
import InstructorTimeLogsPage from './components/TimeLogsPage/InstructorTimeLogsPage'
import SprintsDashboard from './components/SprintsPage/SprintsDashboard'
import TagsDashboard from './components/TagManagementPage/TagsDashboard'
import StudentTagPage from './components/TagPage/StudentTagPage'

// Actions
import appActions from './reducers/actions/appActions'
import * as notificationActions from './reducers/actions/notificationActions'
import loginPageActions from './reducers/actions/loginPageActions'
import configurationPageActions from './reducers/actions/configurationPageActions'
import registrationmanagementActions from './reducers/actions/registrationManagementActions'
import registrationActions from './reducers/actions/registrationActions'
import peerReviewPageActions from './reducers/actions/peerReviewPageActions'
import * as userActions from './reducers/actions/userActions'
import myGroupActions from './reducers/actions/myGroupActions'

// Protected routes
import {
  AdminRoute,
  LoginRoute,
  InstructorRoute,
} from './utils/protectedRoutes'

import loginService from './services/login'

const history = createBrowserHistory({ basename: import.meta.env.BASE_URL })

const NotFound = () => (
  <div className="not-found-page">
    <h1>Page not found</h1>
    <Link data-cy="return-link" to="/">
      Return to the home page
    </Link>
  </div>
)

const App = (props) => {
  const {
    updateIsLoading,
    loginUser,
    fetchRegistrationManagement,
    setError,
    logoutUser,
    clearRegistrations,
    isLoading,
    user,
    initializeMyGroup
  } = props

  useEffect(() => {
    const isCustomerReviewPage = window.location.href.includes('customer-review/')
    const fetchRegistrationManagementData = async () => {
      try {
        await fetchRegistrationManagement()
      } catch (e) {
        console.log('error happened', e)
        setError('Error fetching registration management configuration', 5000)
      }
    }

    const handleGroupInit = async () => {
      try {
        await initializeMyGroup()
      } catch (err) {
        console.log(err)
      }
    }

    const handleLogin = async () => {
      try {
        await loginUser()
      } catch (err) {
        console.log(err)
      }
    }

    const fetchData = async () => {
      updateIsLoading(true)
      !isCustomerReviewPage && (await handleLogin())
      user && (await handleGroupInit())
      await fetchRegistrationManagementData()
      updateIsLoading(false)
    }

    fetchData()

    const loginInterval = setInterval(() => {
      if (!isCustomerReviewPage) {
        try {
          loginService.login()
        } catch (err) {
          console.log(err)
        }
      }
    }, 60 * 1000)

    return () => clearInterval(loginInterval)
  }, [fetchRegistrationManagement, loginUser, setError, updateIsLoading, initializeMyGroup])

  const logout = () => {
    updateIsLoading(true)
    logoutUser()
    clearRegistrations()
    updateIsLoading(false)
  }

  const renderWithLoadingCheck = (component) =>
    isLoading ? () => <LoadingSpinner /> : () => component

  return (
    <Router history={history}>
      <div id="app-wrapper">
        <NavigationBar logout={logout} />
        <Notification />
        <div id="app-content">
          <Switch>
            <Route path="/login" render={renderWithLoadingCheck(null)} />
            <LoginRoute
              exact
              path="/"
              render={renderWithLoadingCheck(<LandingPage />)}
            />
            <AdminRoute
              exact
              path="/topics"
              render={renderWithLoadingCheck(<TopicListPage />)}
            />
            <Route
              exact
              path="/topics/create"
              render={renderWithLoadingCheck(<TopicFormPage />)}
            />
            <Route
              exact
              path="/topics/:id"
              render={renderWithLoadingCheck(<ViewTopicPage {...props} />)}
            />
            <AdminRoute
              exact
              path="/administration/configuration"
              render={renderWithLoadingCheck(<ConfigurationPage />)}
            />
            <AdminRoute
              exact
              path="/administration/participants"
              render={renderWithLoadingCheck(<ParticipantsPage />)}
            />
            <AdminRoute
              exact
              path="/administration/users"
              render={renderWithLoadingCheck(<ViewUsersPage />)}
            />
            <AdminRoute
              exact
              path="/administration/customer-review-questions"
              render={renderWithLoadingCheck(<CustomerReviewQuestionsPage />)}
            />
            <AdminRoute
              exact
              path="/administration/peer-review-questions"
              render={renderWithLoadingCheck(<PeerReviewQuestionsPage />)}
            />
            <AdminRoute
              exact
              path="/administration/registration-questions"
              render={renderWithLoadingCheck(<RegistrationQuestionsPage />)}
            />
            <AdminRoute
              exact
              path="/administration/groups"
              render={renderWithLoadingCheck(<GroupManagementPage />)}
            />
            <AdminRoute
              exact
              path="/administration/email-templates"
              render={renderWithLoadingCheck(<EmailTemplatesPage />)}
            />
            <AdminRoute
              exact
              path="/administration/registrations"
              render={renderWithLoadingCheck(<Registrations />)}
            />
            <AdminRoute
              exact
              path="/administration/reviews"
              render={renderWithLoadingCheck(<InstructorReviews />)}
            />
            <AdminRoute
              exact
              path="/administration/tags"
              render={renderWithLoadingCheck(<TagsDashboard />)}
            />
            <Route
              exact
              path="/customer-review/:id"
              render={renderWithLoadingCheck(<CustomerReviewPage {...props} />)}
            />
            <LoginRoute
              exact
              path="/register"
              user={user}
              render={renderWithLoadingCheck(<RegistrationPage />)}
            />
            <LoginRoute
              exact
              path="/peerreview"
              user={user}
              render={renderWithLoadingCheck(<PeerReviewPage />)}
            />
            <AdminRoute
              exact
              path="/administration/registrationmanagement"
              render={renderWithLoadingCheck(<RegistrationManagementPage />)}
            />
            <InstructorRoute
              exact
              path="/instructorpage"
              render={renderWithLoadingCheck(<InstructorPage />)}
            />
            <InstructorRoute
              exact
              path="/instructorreviewpage"
              render={renderWithLoadingCheck(<InstructorReviewPage />)}
            />
            <InstructorRoute
              path="/adminstration/customer-reviews"
              render={renderWithLoadingCheck(<ViewCustomerReviewsPage />)}
            />
            <InstructorRoute
              path="/instructor-timelogs"
              render = {renderWithLoadingCheck(<InstructorTimeLogsPage />)}
            />
            <LoginRoute
              exact
              path="/registrationdetails"
              render={renderWithLoadingCheck(<RegistrationDetailsPage />)}
            />
            <LoginRoute
              exact
              path="/timelogs"
              render={renderWithLoadingCheck(<TimeLogsPage />)}
            />
            <LoginRoute
              exact
              path="/sprints"
              render={renderWithLoadingCheck(<SprintsDashboard />)}
            />
            <LoginRoute
              exact
              path="/student-tags"
              render={renderWithLoadingCheck(<StudentTagPage />)}
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
    user: state.login.user,
  }
}

const mapDispatchToProps = {
  setError: notificationActions.setError,
  ...loginPageActions,
  ...appActions,
  fetchConfigurations: configurationPageActions.fetchConfigurations,
  fetchRegistrationManagement:
    registrationmanagementActions.fetchRegistrationManagement,
  clearRegistrations: registrationActions.clearRegistrations,
  ...peerReviewPageActions,
  logoutUser: userActions.logoutUser,
  loginUser: userActions.loginUser,
  initializeMyGroup: myGroupActions.initializeMyGroup,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
