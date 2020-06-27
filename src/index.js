import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from '_redux'
import * as serviceWorker from './serviceWorker'
import App from './App'

import './assets/css/bootstrap-utils.css'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))

serviceWorker.unregister()