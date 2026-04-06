import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import App from './App'
import store from './reducers/store'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import CssBaseline from '@material-ui/core/CssBaseline'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const Root = () => {
  const dark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = createTheme({
    palette: {
      type: dark ? 'dark' : 'light',
      primary: {
        main: '#fdd835',
      },
      secondary: amber,
      text: {
        primary: dark ? '#ffffff' : '#4d4d4d',
      },
    },
    typography: {
      useNextVariants: true,
      h1: {
        marginTop: '0.67em',
        marginBottom: '0.67em',
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 3,
      },
      h3: {
        marginTop: '1em',
        marginBottom: '1em',
      },
      h4: {
        marginTop: '1.33em',
        marginBottom: '1.33em',
      },
      h5: {
        marginTop: '1.67em',
        marginBottom: '1.67em',
      },
    },
  })

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
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
