import React, { useState, useEffect } from 'react'

// Import other modules
import { Router } from 'react-router-dom'
import { Chart } from 'react-chartjs-2'
import validate from 'validate.js'

// Import Material UI components
import { ThemeProvider } from '@material-ui/styles'

// Import local
import theme from './theme'
import Routes from './Routes'
import { chartjs } from './helpers'
import { history } from 'helpers/route'
import validators from './common/validators'
import { useDispatch, useSelector } from "react-redux";
import { actions } from '_redux';

// Import CSS, SCSS
import 'react-perfect-scrollbar/dist/css/styles.css'
import './assets/scss/index.scss'

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
})

validate.validators = {
  ...validate.validators,
  ...validators
}



const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.authCheckState())
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Routes />
      </Router>
    </ThemeProvider>
  )
}

export default App
