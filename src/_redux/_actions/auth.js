import axios from 'axios'
import * as actions_types from '../_actions_types/auth.actions'
import { host, history } from 'helpers/route'

export const startLoading = () => {
    return {
        type: actions_types.START_LOADING
    }
}

export const finishLoading = () => {
    return {
        type: actions_types.FINISH_LOADING
    }
}

export const authStart = () => {
    return {
        type: actions_types.AUTH_START
    }
}

export const authSuccess = (token, user) => {
    return {
        type: actions_types.AUTH_SUCCESS,
        token: token,
        user: user
    }
}

export const authFail = error => {
    return {
        type: actions_types.AUTH_FAIL,
        error: error
    }
}

export const saveTimeOut = id => {
    return {
        type: actions_types.CHECK_LOGIN,
        time: id
    }
}

export const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    history.push('/sign-in');
    return {
        type: actions_types.AUTH_LOGOUT,
        time: null
    }
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        let time = setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000)
        dispatch(saveTimeOut(time))

    }
}

export const authLogin = (email, password) => {
    return dispatch => {
        dispatch(authStart())
        axios.post(`${host}/accounts/login/`, {
            email: email,
            password: password
        })
            .then(res => {
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
                localStorage.setItem('token', JSON.stringify(res.data["token"]))
                localStorage.setItem('user', JSON.stringify(res.data["user"]))
                localStorage.setItem('expirationDate', expirationDate)
                dispatch(authSuccess(res.data['token'], res.data['user']))
                dispatch(checkAuthTimeout(3600))
                history.push('/dashboard');
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            dispatch(authFail("Authentication failure: Verify your credentials"))
                            break;
                        default:
                            dispatch(authFail(err.data))
                            break;
                    }
                }

            })
    }
}

// export const authSignup = (username, email, password1, password2) => {
//     return dispatch => {
//         dispatch(authStart())
//         axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
//             username: username,
//             email: email,
//             password1: password1,
//             password2: password2
//         })
//             .then(res => {
//                 const token = res.data.key
//                 const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
//                 localStorage.setItem('token', token)
//                 localStorage.setItem('expirationDate', expirationDate)
//                 dispatch(authSuccess(token))
//                 dispatch(checkAuthTimeout(3600))
//             })
//             .catch(err => {
//                 dispatch(authFail(err))
//             })
//     }
// }

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if (token === undefined || token === null) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date()) {
                dispatch(logout())
            } else {
                // dispatch(authSuccess(JSON.parse(token)))
                // dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
                dispatch(checkAuthTimeout(3600))
            }
        }
    }
}
