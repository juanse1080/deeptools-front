import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
const host = "http://localhost:8000"
const ws = 'ws://localhost:8000';

export { history, host, ws }