import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

// Import all reducers here
import appReducer from './appReducer'
import loginPageReducer from './loginPageReducer'
import topicFormPageReducer from './topicFormPageReducer'
import topicListPageReducer from './topicListPageReducer'
import notificationReducer from './notificationReducer'

// Combine imported reducers
const reducer = combineReducers({
  app: appReducer,
  loginPage: loginPageReducer,
  topicFormPage: topicFormPageReducer,
  topicListPage: topicListPageReducer,
  notifications: notificationReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

store.subscribe(() => {
  console.log(store.getState())
})

export default store
