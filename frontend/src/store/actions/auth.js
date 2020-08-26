import * as actionTypes from './actionTypes'
import webSocketInstance from '../../websocket'
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
    try {
        if (webSocketInstance.state()) {
            webSocketInstance.disconnect()
        }
    } catch (error) {
        console.log('')
    }
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('expire')
    localStorage.removeItem('chatID')
    localStorage.removeItem('chatName')
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
                let errMsg = ''
                if (err.response.data.non_field_errors) errMsg = errMsg + err.response.data.non_field_errors[0] + '\n'
                if (err.response.data.username) errMsg = errMsg + 'Username should not be blank.\n'
                if (err.response.data.password) errMsg = errMsg + 'Password should not be blank.\n'
                dispatch(authFail(errMsg))
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
                let errMsg = ''
                if (err.response.data.username) errMsg = errMsg + 'Username should not be blank.\n'
                if (err.response.data.email) errMsg = errMsg + err.response.data.email + '\n'
                if (err.response.data.password1) errMsg = errMsg + err.response.data.password1 + '\n'
                dispatch(authFail(errMsg))
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