import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import userHandler from './middleware/userHandler'

// Import all reducers here
import appReducer from './appReducer'
import loginPageReducer from './loginPageReducer'
import topicListPageReducer from './topicListPageReducer'
import notificationReducer from './notificationReducer'
import topicFormReducer from './topicFormReducer'
import viewTopicPageReducer from './viewTopicPageReducer'
import registrationPageReducer from './registrationPageReducer'
import configurationPageReducer from './configurationPageReducer'
import questionsFormPageReducer from './questionsFormPageReducer'
import registrationQuestionsPageReducer from './registrationQuestionsPageReducer'
import peerReviewQuestionsPageReducer from './peerReviewQuestionsPageReducer'
import registrationManagementReducer from './registrationManagementReducer'
import registrationReducer from './registrationReducer'
import groupPageReducer from './groupPageReducer'
import peerReviewReducer from './peerReviewReducer'
import myGroupReducer from './myGroupReducer'
import emailTemplatesReducer from './emailTemplatesReducer'
import instructorPageReducer from './instructorPageReducer'
import customerReviewPageReducer from './customerReviewPageReducer'
import customerReviewQuestionsPageReducer from './customerReviewQuestionsPageReducer'
import instructorReviewPageReducer from './instructorReviewPageReducer'
import userReducer from './userReducer'
import viewCustomerReviewsPageReducer from './viewCustomerReviewsPageReducer'

// Combine imported reducers
const reducer = combineReducers({
  app: appReducer,
  loginPage: loginPageReducer,
  topicFormPage: topicFormReducer,
  topicListPage: topicListPageReducer,
  notifications: notificationReducer,
  viewTopicPage: viewTopicPageReducer,
  registrationPage: registrationPageReducer,
  configurationPage: configurationPageReducer,
  questionsFormPage: questionsFormPageReducer,
  registrationQuestionsPage: registrationQuestionsPageReducer,
  peerReviewQuestionsPage: peerReviewQuestionsPageReducer,
  customerReviewQuestionsPage: customerReviewQuestionsPageReducer,
  registrationManagement: registrationManagementReducer,
  registrations: registrationReducer,
  groupPage: groupPageReducer,
  peerReviewPage: peerReviewReducer,
  registrationDetails: myGroupReducer,
  emailTemplates: emailTemplatesReducer,
  instructorPage: instructorPageReducer,
  customerReviewPage: customerReviewPageReducer,
  instructorReviewPage: instructorReviewPageReducer,
  user: userReducer,
  viewCustomerReviewsPage: viewCustomerReviewsPageReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

let initialStore
let tokenString = window.localStorage.getItem('loggedInUser')
if (tokenString) {
  const user = JSON.parse(tokenString)
  initialStore = { user }
}

const store = createStore(
  reducer,
  initialStore,
  composeEnhancers(applyMiddleware(userHandler, thunk))
)

export default store
