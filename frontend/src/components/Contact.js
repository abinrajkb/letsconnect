import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeChat } from '../store/actions/chat'
/* import Chat from '../containers/Chat' */

export class Contact extends Component {

    changeChat = e => {
        this.props.changeChat(this.props.chatID, this.props.name)
    }

    render() {
        return (
            //<NavLink to={`/${this.props.chatID}`} style={{ color: '#fff' }}>
            <li className="contact" onClick={this.changeChat}>
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src={this.props.picURL} alt="" />
                    <div className="meta">
                        <p className="name">{this.props.name}</p>
                        {/* <p className="preview">You just got LITT up, Mike.</p> */}
                    </div>
                </div>
            </li>
            //</NavLink>
        )
    }
}

export default connect(null, { changeChat })(Contact)
