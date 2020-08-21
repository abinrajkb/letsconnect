import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export class Contact extends Component {
    render() {
        return (
            <NavLink to={`${this.props.chatURL}`} style={{ color: '#fff' }}>
                <li className="contact">
                    <div className="wrap">
                        <span className="contact-status online"></span>
                        <img src={this.props.picURL} alt="" />
                        <div className="meta">
                            <p className="name">{this.props.name}</p>
                            {/* <p className="preview">You just got LITT up, Mike.</p> */}
                        </div>
                    </div>
                </li>
            </NavLink>
        )
    }
}

export default Contact
