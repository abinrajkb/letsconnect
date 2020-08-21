import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { logout } from '../store/actions/auth'
import Contact from '../components/Contact'

export class Sidepanel extends Component {

    state = {
        chats: []
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        console.log("hello")
        if (newProps.contactState.token !== null && newProps.contactState.username !== null) {
            this.getUserChats(newProps.contactState.token, newProps.contactState.username)
        }
    }
    componentDidMount() {
        if (this.props.contactState.token !== null && this.props.contactState.username !== null) {
            this.getUserChats(this.props.contactState.token, this.props.contactState.username)
        }
    }

    /* componentDidUpdate(prevProps, prevState) {
        if (this.props.contactState.token !== null && this.props.contactState.username !== null) {
            this.getUserChats(this.props.contactState.token, this.props.contactState.username)
        }
    } */

    getUserChats = (token, username) => {
        /* axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        } */
        axios.get(`http://127.0.0.1:8000/chat/?username=${username}`)
            .then(res => {
                this.setState({ chats: res.data })
            })
    }

    render() {

        const activeChats = this.state.chats.map(c => {
            return (
                <Contact key={c.id} name="harvey" status="online" chatURL={`/${c.id}`}
                    picURL="http://emilcarlsson.se/assets/louislitt.png" />
            )
        })

        return (
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                        <p>Mike Ross</p>
                        <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                        <div id="status-options">
                            <ul>
                                <li id="status-online" className="active"><span className="status-circle"></span>
                                    <p>Online</p>
                                </li>
                                <li id="status-away"><span className="status-circle"></span>
                                    <p>Away</p>
                                </li>
                                <li id="status-busy"><span className="status-circle"></span>
                                    <p>Busy</p>
                                </li>
                                <li id="status-offline"><span className="status-circle"></span>
                                    <p>Offline</p>
                                </li>
                            </ul>
                        </div>
                        {/* <div id="expanded">
                        <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mikeross" />
                        <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="ross81" />
                        <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mike.ross" />
                    </div> */}
                    </div>
                </div>
                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" placeholder="Search contacts..." />
                </div>
                <div id="contacts">
                    <ul>

                        {activeChats}

                        {/* <Contact name="harvey" status="online" chatURL="/harvey"
                            picURL="http://emilcarlsson.se/assets/louislitt.png" />

                        <Contact name="abinraj" status="active" chatURL="/abinraj"
                            picURL="http://emilcarlsson.se/assets/harveyspecter.png" /> */}

                    </ul>
                </div>
                {/* <div id="logout-bar" style={{ paddingBottom: "50px" }}>
                <button id="logout"><i className="fa fa-lock fa-fw" aria-hidden="true"></i> <span>Logout</span></button>
            </div> */}
                <div id="bottom-bar">
                    <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add
                        contact</span></button>
                    <button id="settings" onClick={this.props.logout}><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Logout</span></button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    contactState: state
})

export default connect(mapStateToProps, { logout })(Sidepanel)

