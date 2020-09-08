import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
// local
// const host = "http://localhost:8000"
// const ws = 'ws://localhost:8000'

// casa
const host = "http://192.168.1.10:8000"
const ws = 'ws://192.168.1.10:8000'

// mariana
// const host = "http://192.168.0.21:8000"
// const ws = 'ws://192.168.0.21:8000'

// paola
// const host = "http://192.168.1.19:8000"
// const ws = 'ws://192.168.1.19:8000'



export { history, host, ws }