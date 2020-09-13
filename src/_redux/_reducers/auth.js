import * as actions_types from '../_actions_types/auth.actions'
import { updateObject } from '../utility'
import { reloadState } from '_redux/_actions/auth'

const initialState = {
    token: null,
    error: null,
    loading: false,
    time: null,
    user: null
}

const startLoading = (state, action) => {
    return updateObject(state, {
        loading: true
    })
}

const finishLoading = (state, action) => {
    return updateObject(state, {
        loading: false
    })
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    })
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        user: action.user,
        error: null,
        loading: false
    })
}

const authUpdate = (state, action) => {
    return updateObject(state, {
        user: action.user,
        error: null,
        loading: false
    })
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        user: null
    })
}

const saveTimeOut = (state, action) => {
    if (state.time) {
        clearTimeout(state.time)
    }
    return updateObject(state, {
        time: action.time
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions_types.AUTH_START: return authStart(state, action)
        case actions_types.AUTH_SUCCESS: return authSuccess(state, action)
        case actions_types.AUTH_UPDATE: return authUpdate(state, action)
        case actions_types.AUTH_FAIL: return authFail(state, action)
        case actions_types.AUTH_LOGOUT: return authLogout(state, action)
        case actions_types.CHECK_LOGIN: return saveTimeOut(state, action)
        case actions_types.START_LOADING: return startLoading(state, action)
        case actions_types.FINISH_LOADING: return finishLoading(state, action)
        default:
            return state
    }
}

export default reducer