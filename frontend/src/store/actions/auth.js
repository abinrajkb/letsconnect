import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (username, token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('expire')
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const checkAuthTimeout = (expire) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expire * 1000)
    }
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/rest-auth/login/', {
            username: username,
            password: password
        }).then(res => {
            const token = res.data.key;
            const expire = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token', token)
            localStorage.setItem('username', username)
            localStorage.setItem('expire', expire)
            dispatch(authSuccess(username, token))
            dispatch(checkAuthTimeout(3600))
        })
            .catch(err => {
                dispatch(authFail(err))
            })
    }
}

export const authSignup = (username, email, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password,
            password2: password
        }).then(res => {
            const token = res.data.key;
            const expire = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token', token)
            localStorage.setItem('username', username)
            localStorage.setItem('expire', expire)
            dispatch(authSuccess(username, token))
            dispatch(checkAuthTimeout(3600))
        })
            .catch(err => {
                dispatch(authFail(err))
            })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        if (token === undefined) {
            dispatch(logout())
        }
        else {
            const expire = new Date(localStorage.getItem('expire'))
            if (expire <= new Date()) {
                dispatch(logout())
            }
            else {
                dispatch(authSuccess(username, token))
                dispatch(checkAuthTimeout((expire.getTime() - new Date().getTime()) / 1000))
            }
        }
    }
}