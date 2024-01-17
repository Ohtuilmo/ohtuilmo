import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import App from './App'
import store from './reducers/store'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fdd835'
    },
    secondary: amber
  },
  typography: {
    useNextVariants: true
  }
})

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
