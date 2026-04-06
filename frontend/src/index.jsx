import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import App from './App'
import store from './reducers/store'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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

const Root = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  console.log(prefersDarkMode)

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)

if (window.Cypress) {
  window.store = store
}
