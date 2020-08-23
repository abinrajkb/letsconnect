import * as actionTypes from './actionTypes'

export const changeChat = (chatID, chatName) => {
    localStorage.setItem('chatID', chatID)
    localStorage.setItem('chatName', chatName)
    return {
        type: actionTypes.CHANGE_CHAT,
        chatID: chatID,
        chatName: chatName
    }
}

export const checkChat = () => {
    return dispatch => {
        const chatID = localStorage.getItem('chatID')
        const chatName = localStorage.getItem('chatName')
        if (chatID !== undefined) {
            dispatch(changeChat(chatID, chatName))
        }
    }
}