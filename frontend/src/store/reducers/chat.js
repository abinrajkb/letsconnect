import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialState = {
    chatID: null,
    chatName: null
}

const changeChat = (state, action) => {
    return updateObject(state, {
        chatID: action.chatID,
        chatName: action.chatName
    })
}

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_CHAT: return changeChat(state, action)
        default: return state
    }
}

export default chatReducer