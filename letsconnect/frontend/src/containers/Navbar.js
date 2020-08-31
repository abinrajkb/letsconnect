import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

export class Navbar extends Component {

    deleteChat = e => {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            'Authorization': `Token ${this.props.authState.token}`
        }
        const ID = this.props.currentChat.chatID
        axios.delete(`${process.env.DOMAIN_NAME}/chat/${ID}/delete/`)
            .then(res => {
                window.location.reload(false);
            })
            .catch(err => {
                console.log('')
            })

    }

    render() {
        return (
            <div className="contact-profile">
                <img src={`${process.env.DOMAIN_NAME}/media/${this.props.picURL}`} alt="" />
                <p onChange={this.getPicURL}>{this.props.currentChat.chatName}</p>
                <div className="social-media">
                    <i className="fa fa-trash" onClick={this.deleteChat} aria-hidden="true"></i>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentChat: state.chat,
    authState: state.auth
})

export default connect(mapStateToProps)(Navbar)
