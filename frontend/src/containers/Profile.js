import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Profile extends Component {
    render() {
        return (
            <div className="contact-profile">
                <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                {<p>{this.props.currentChat.chatName}</p>}
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                    <i className="fa fa-instagram" aria-hidden="true"></i>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentChat: state.chat,
})

export default connect(mapStateToProps)(Profile)
