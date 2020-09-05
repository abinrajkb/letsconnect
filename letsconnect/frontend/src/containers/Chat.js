import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import webSocketInstance from '../websocket'
import '../assets/style.css'
import Navbar from './Navbar'

class Chat extends Component {

    state = {
        message: '',
        chatID: null,
        newSession: true,
        picURL: ''
    }

    componentDidMount() {
        this.setState({ chatID: this.props.currentChat.chatID })
        this.scrollToBottom();
    }

    componentDidUpdate(newProps) {
        this.scrollToBottom();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (this.state.chatID !== newProps.currentChat.chatID) {
            this.setState({ chatID: newProps.currentChat.chatID })
            this.getPicURL(newProps.currentChat.chatName)
            if (!this.state.newSession) {
                webSocketInstance.disconnect()
            }
            this.setState({ newSession: false })
            this.waitForSocketConnection(() => {
                webSocketInstance.addCallbacks(
                    this.setMessages.bind(this),
                    this.addMessage.bind(this)
                );
                webSocketInstance.fetchMessages(this.props.chatState.username, newProps.currentChat.chatID)
            })
            webSocketInstance.connect(newProps.currentChat.chatID)
        }
    }

    getPicURL = (chatName) => {
        axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.chatState.token}`
        }
        axios.get(`${process.env.DOMAIN_NAME}/chat/profile/`, {
            params: {
                username: chatName
            }
        })
            .then(res => {
                this.setState({ picURL: res.data.picURL })
            })
            .catch(err => { })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(function () {
            if (webSocketInstance.state() === 1) {
                callback();
                return;
            }
            else {
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
            prefix = `${Math.abs(timeDiff)} seconds ago`
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
            chatID: this.props.currentChat.chatID
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

                {(!this.state.newSession) ? <Navbar picURL={this.state.picURL} /> : ''}


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

                {(!this.state.newSession) ?

                    <div className="message-input">
                        <form onSubmit={this.sendMessageHandler}>
                            <div className="wrap">
                                <input id="chat-message-input" type="text" placeholder="Write your message..."
                                    value={this.state.message} onChange={this.messageChangeHandler} autoComplete="off" />
                                <button id="chat-message-submit" className="submit">
                                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    :
                    ''
                }

            </div>


        )
    }
}

const mapStateToProps = state => ({
    chatState: state.auth,
    currentChat: state.chat
})

export default connect(mapStateToProps)(Chat)