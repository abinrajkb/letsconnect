import React, { Component } from 'react'
import { connect } from 'react-redux'
import webSocketInstance from '../websocket'
import '../assets/style.css'

class Chat extends Component {

    state = { message: '' }

    constructor(props) {
        super(props)
        this.initializeChat();
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate(newProps) {
        this.scrollToBottom();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (this.props.match.params.chatID !== newProps.match.params.chatID) {
            webSocketInstance.disconnect()
            this.waitForSocketConnection(() => {
                webSocketInstance.fetchMessages(this.props.chatState.username, newProps.match.params.chatID)
            })
            webSocketInstance.connect(newProps.match.params.chatID)
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    initializeChat() {
        this.waitForSocketConnection(() => {
            webSocketInstance.addCallbacks(
                this.setMessages.bind(this),
                this.addMessage.bind(this)
            );
            webSocketInstance.fetchMessages(this.props.chatState.username, this.props.match.params.chatID)
        })
        webSocketInstance.connect(this.props.match.params.chatID)
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(function () {
            if (webSocketInstance.state() === 1) {
                console.log("connection is made")
                callback();
                return;
            }
            else {
                console.log("waiting for connection")
                component.waitForSocketConnection(callback)
            }
        }, 100)
    }

    addMessage(message) {
        this.setState({
            messages: [...this.state.messages, message]
        })
    }

    setMessages(messages) {
        this.setState({
            messages: messages.reverse()
        })
    }

    renderTimestamp = timestamp => {
        let prefix = ''
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime()) / 1000)
        if (timeDiff < 60) {
            prefix = `${timeDiff} seconds ago`
        }
        else if (timeDiff < 60 * 60 && timeDiff > 60) {
            prefix = `${Math.round(timeDiff / 60)} minutes ago`
        }
        else if (timeDiff < 24 * 60 * 60 && timeDiff > 60 * 60) {
            prefix = `${Math.round(timeDiff / (60 * 60))} hours ago`
        }
        else if (timeDiff < 31 * 24 * 60 * 60 && timeDiff > 24 * 60 * 60) {
            prefix = `${Math.round(timeDiff / (60 * 60 * 24))} days ago`
        }
        else {
            prefix = `${new Date(timestamp)}`
        }
        return prefix
    }

    renderMessages = (messages) => {
        const currentUser = this.props.chatState.username
        return messages.map(message => (
            <li key={message.id} className={message.author === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>
                    {message.content}
                    <br />
                    <small>
                        {this.renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ))
    }

    sendMessageHandler = e => {
        e.preventDefault();
        const messageObject = {
            from: this.props.chatState.username,
            content: this.state.message,
            chatID: this.props.match.params.chatID
        }
        webSocketInstance.newChatMessage(messageObject)
        this.setState({
            message: ''
        })
    }

    messageChangeHandler = event => {
        this.setState({
            message: event.target.value
        })
    }

    render() {

        const messages = this.state.messages;

        return (

            <div>
                <div className="messages">
                    <ul id="chat-log">
                        {
                            messages &&
                            this.renderMessages(messages)
                        }
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                        <div className="wrap">
                            <input id="chat-message-input" type="text" style={{ fontSize: "20px" }} placeholder="Write your message..."
                                value={this.state.message} onChange={this.messageChangeHandler} />
                            <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                            <button id="chat-message-submit" className="submit">
                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>

                </div>
                {/* <input id="room_name" type="hidden" value="{{ room_name }}" />
                <input id="user_name" type="hidden" value="{{ user_name }}" /> */}
            </div>


        )
    }
}

const mapStateToProps = state => ({
    chatState: state
})

export default connect(mapStateToProps)(Chat)