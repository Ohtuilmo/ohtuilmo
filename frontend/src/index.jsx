import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import App from './App'
import store from './reducers/store'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const Root = () => {
  const dark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = createTheme({
    palette: {
      type: dark ? 'dark' : 'light',
      primary: {
        main: '#fdd835',
      },
      secondary: amber
    },
    typography: {
      useNextVariants: true
    },
  })

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
