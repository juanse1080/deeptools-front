import thunk from 'redux-thunk'
import reducer from '../_reducers/auth'
import { createStore, compose, applyMiddleware } from 'redux'

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
))

export default store