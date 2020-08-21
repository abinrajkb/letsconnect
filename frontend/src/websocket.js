
class webSocketService {

    static instance = null;
    callbacks = {}

    static getInstance() {
        if (!webSocketService.instance) {
            webSocketService.instance = new webSocketService();
        }
        return webSocketService.instance
    }

    constructor() {
        this.socketRef = null;
    }

    connect(chatURL) {
        const path = `ws://127.0.0.1:8000/ws/chat/${chatURL}/`;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            console.log("websocket open");
        }
        /* this.socketNewMessage(JSON.stringify({
            'command': 'fetch_messages'
        })) */
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data)
        }
        this.socketRef.onerror = e => {
            console.log(e.message);
        }
        this.socketRef.onclose = () => {
            console.log("websocket is closed")
            this.connect(chatURL);
        }
    }

    disconnect() {
        this.socketRef.close()
    }

    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) { return }
        if (command === 'messages') {
            this.callbacks[command](parsedData.messages)
        }
        if (command === 'new_message') {
            this.callbacks[command](parsedData.message)
        }
    }

    fetchMessages(username, chatID) {
        this.sendMessage({ command: 'fetch_messages', username: username, chatID: chatID })
    }

    newChatMessage(message) {
        this.sendMessage({
            command: 'new_message', from: message.from,
            message: message.content, chatID: message.chatID
        })
    }

    addCallbacks(messagesCallback, newMessageCallback) {
        this.callbacks['messages'] = messagesCallback
        this.callbacks['new_message'] = newMessageCallback
    }

    sendMessage(data) {
        try {
            this.socketRef.send(JSON.stringify({ ...data }))
        } catch (err) {
            console.log(err.message)
        }
    }

    state() {
        return this.socketRef.readyState
    }

}

const webSocketInstance = webSocketService.getInstance()

export default webSocketInstance