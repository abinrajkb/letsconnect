import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { logout } from '../store/actions/auth'
import { clearChat } from '../store/actions/chat'
import Contact from '../components/Contact'

export class Sidepanel extends Component {

    state = {
        chats: [],
        newChatUsername: '',
        error: null
    }

    UNSAFE_componentWillReceiveProps(newProps) {
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
        axios.get(`http://127.0.0.1:8000/chat/?username=${username}`)
            .then(res => {
                this.setState({ chats: res.data })
            })
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    addChat = e => {
        e.preventDefault()
        axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.contactState.token}`
        }
        axios.post('http://127.0.0.1:8000/chat/create/', {
            created_by: this.props.contactState.username,
            created_for: this.state.newChatUsername
        })
            .then(res => {
                this.setState({ error: null })
                this.getUserChats(this.props.contactState.token, this.props.contactState.username)
            })
            .catch(err => {
                this.setState({ error: err.response.data })
            })

        this.setState({ newChatUsername: '' })
    }

    addChatBtnClick = () => {
        document.getElementById("expand").click();
    }

    clearStorage = () => {
        this.props.logout()
        this.props.clearChat()
    }

    render() {

        const activeChats = this.state.chats.map(c => {
            let chatName = null
            if (c.created_by == this.props.contactState.username) chatName = c.created_for
            else chatName = c.created_by
            return (
                <Contact key={c.id} name={chatName} status="online" chatID={c.id}
                    picURL="http://emilcarlsson.se/assets/harveyspecter.png" />
            )
        })

        /* let errorMsg = null
        if (this.state.error) {
            errorMsg = (<p>{this.state.error}</p>)
        } */

        return (
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                        <p>{this.props.contactState.username}</p>
                        <i className="fa fa-chevron-down expand-button" aria-hidden="true" id="expand"></i>
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
                        <div id="expanded">

                            <div id="error">{this.state.error}</div>

                            <form onSubmit={this.addChat}>
                                <input name="newChatUsername" type="text" onChange={this.onChange}
                                    value={this.state.newChatUsername} placeholder="enter the userID" />
                                <button type="submit">start chat</button>
                            </form>
                            {/* <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mikeross" />
                        <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="ross81" />
                        <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true"></i></label>
                        <input name="twitter" type="text" value="mike.ross" /> */}
                        </div>
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

                <div id="bottom-bar">

                    {/* <button id="addcontact" onClick={this.addChat}><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add
                        contact</span></button> */}
                    <button id="addcontact" onClick={this.addChatBtnClick}><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add
                        contact</span></button>

                    <button id="settings" onClick={this.clearStorage}><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Logout</span></button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    contactState: state.auth
})

export default connect(mapStateToProps, { logout, clearChat })(Sidepanel)

