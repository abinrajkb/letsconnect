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
        axios.delete(`http://127.0.0.1:8000/chat/${ID}/delete/`)
            .then(res => {
                console.log("chat deleted")
                window.location.reload(false);
            })
            .catch(err => {
                console.log(err.response)
            })

    }

    render() {
        return (
            <div className="contact-profile">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                {<p>{this.props.currentChat.chatName}</p>}
                <div className="social-media">
                    {/* <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i> */}
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
