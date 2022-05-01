import React, { useState, useEffect } from 'react';

// Import other modules
import { Router } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';
import validate from 'validate.js';
import axios from 'axios'

// Import Material UI components
import { ThemeProvider } from '@material-ui/styles';

// Import local
import theme from './theme';
import Routes from './Routes';
import { chartjs } from './helpers';
import { history } from 'helpers/route';
import validators from './common/validators';
import { useDispatch } from 'react-redux';
import { actions } from '_redux';

// Import CSS, SCSS
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/css/index.css';

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

axios.interceptors.request.use(request => {
  if (request.method === 'put') {
    request.method = 'post'
    request.headers['X-HTTP-Method-Override'] = 'put'
    console.log(request.headers)
  }

  if (request.method === 'delete') {
    request.method = 'post'
    request.headers['X-HTTP-Method-Override'] = 'delete'
  }

  return request
})

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(navigator.userAgent.toLowerCase())
    dispatch(actions.reloadState());
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? null : (
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <Routes />
          </Router>
        </ThemeProvider>
      )}
    </>
  );
};

export default App;
