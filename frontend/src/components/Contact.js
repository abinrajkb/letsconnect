import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { changeChat } from '../store/actions/chat'

export class Contact extends Component {

    state = {
        picURL: ''
    }

    constructor(props) {
        super(props)
        this.getPicURL()
    }

    getPicURL = () => {
        axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.token}`
        }
        axios.get('http://127.0.0.1:8000/chat/profile/', {
            params: {
                username: this.props.name
            }
        })
            .then(res => {
                this.setState({ picURL: res.data.picURL })
            })
            .catch(err => {
                console.log('')
            })
    }

    changeChat = e => {
        this.props.changeChat(this.props.chatID, this.props.name)
    }

    render() {
        return (
            <li className="contact" onClick={this.changeChat}>
                <div className="wrap">
                    <img src={`http://localhost:8000/media/${this.state.picURL}`} />
                    <div className="meta">
                        <p className="name">{this.props.name}</p>
                        {/* <p className="preview">How are you..</p> */}
                    </div>
                </div>
            </li>
        )
    }
}

export default connect(null, { changeChat })(Contact)
