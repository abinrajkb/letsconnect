import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { logout } from '../store/actions/auth'
import { clearChat } from '../store/actions/chat'
import Contact from '../components/Contact'

const Compress = require('compress.js')


export class Sidepanel extends Component {

    state = {
        chats: [],
        filteredChats: [],
        searchInput: '',
        toggleAddchat: false,
        toggleChangeDp: false,
        newChatUsername: '',
        newDp: null,
        changeChatError: null,
        changeDpError: null,
        picURL: '',
    }

    constructor(props) {
        super(props)
        this.getPicURL()
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

    getPicURL = () => {
        axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.props.contactState.token}`
        }
        axios.get('http://127.0.0.1:8000/chat/profile/', {
            params: {
                username: this.props.contactState.username
            }
        })
            .then(res => {
                this.setState({ picURL: res.data.picURL })
                localStorage.setItem("profilePic", res.data.picURL)
            })
            .catch(err => {
                console.log('an error occured while fetching the profile pic')
            })
    }

    getUserChats = (token, username) => {
        axios.get(`http://127.0.0.1:8000/chat/?username=${username}`)
            .then(res => {
                this.setState({ chats: res.data })
                this.setState({ filteredChats: res.data })

            })
    }

    searchFilter = e => {
        this.setState({ [e.target.name]: e.target.value })
        const filteredChats = this.state.chats.filter(chat => {
            let chatName = null
            if (chat.created_by == this.props.contactState.username) chatName = chat.created_for
            else chatName = chat.created_by
            return chatName.toLowerCase().includes(e.target.value.toLowerCase())
        })
        this.setState({ filteredChats: filteredChats })
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value })

    onFileChange = e => {
        const files = [...e.target.files]
        const compress = new Compress()
        const resizedImage = compress.compress(files, {
            size: 1,
            quality: 1,
            maxWidth: 100,
            maxHeight: 100,
            resize: true
        }).then(data => {
            const base64str = data[0].data
            const imgExt = data[0].ext
            const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
            this.setState({ newDp: resizedFiile })
            this.setState({ changeDpError: null })
        }).catch(err => {
            this.setState({ changeDpError: "select a valid image" })
        })
    }

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
                this.setState({ changeChatError: null })
                this.getUserChats(this.props.contactState.token, this.props.contactState.username)
                this.setState({ toggleAddchat: false })
                this.setState({ newChatUsername: '' })
            })
            .catch(err => {
                this.setState({ changeChatError: err.response.data })
            })

        this.setState({ newChatUsername: '' })
    }

    changeDp = e => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("username", this.props.contactState.username);
        formData.append("newDp", this.state.newDp);
        axios.defaults.headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${this.props.contactState.token}`
        }
        axios.post('http://127.0.0.1:8000/chat/profile/', formData)
            .then(res => {
                this.setState({ picURL: res.data.picURL })
                this.setState({ newDp: null })
                this.setState({ toggleChangeDp: false })
                this.setState({ changeDpError: null })
                localStorage.setItem("profilePic", res.data.picURL)
            })
            .catch(err => {
                this.setState({ changeDpError: err.response.data })
            })
    }

    addChatBtnClick = () => {
        this.setState({ toggleChangeDp: false })
        this.setState({ toggleAddchat: !this.state.toggleAddchat })
    }

    changeDpBtnClick = () => {
        this.setState({ toggleAddchat: false })
        this.setState({ toggleChangeDp: !this.state.toggleChangeDp })
    }

    clearStorage = () => {
        this.props.logout()
        this.props.clearChat()
    }

    render() {

        const activeChats = this.state.filteredChats.map(c => {
            let chatName = null
            if (c.created_by == this.props.contactState.username) chatName = c.created_for
            else chatName = c.created_by
            return (
                <Contact key={c.id} name={chatName} chatID={c.id}
                    token={this.props.contactState.token} />
            )
        })

        return (
            <div id="sidepanel">
                <div id="profile">
                    <div className="wrap">
                        <img id="profile-img" src={`http://localhost:8000/media/${this.state.picURL}`} className="online" alt="" />
                        <p>{this.props.contactState.username}</p>

                        <div id="expanded">

                            {this.state.toggleAddchat ?
                                <div>
                                    <div className="error">{this.state.changeChatError}</div>
                                    <form onSubmit={this.addChat}>
                                        <input name="newChatUsername" type="text" onChange={this.onChange}
                                            value={this.state.newChatUsername} placeholder="enter the userID" />
                                        <button type="submit">start chat</button>
                                    </form>
                                </div>

                                :
                                ''

                            }

                            {this.state.toggleChangeDp ?

                                <div>
                                    <div className="error">{this.state.changeDpError}</div>
                                    <form onSubmit={this.changeDp}>
                                        <input id="newDp" name="newDp" type="file" onChange={this.onFileChange} />
                                        <button type="submit">change DP</button>
                                    </form>
                                </div>
                                :
                                ''
                            }
                        </div>

                    </div>
                </div>
                <div id="search">
                    <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                    <input type="text" value={this.state.searchInput} onChange={this.searchFilter}
                        name="searchInput" placeholder="Search contacts..." />
                </div>
                <div id="contacts">
                    <ul>

                        {activeChats}

                    </ul>
                </div>

                <div id="bottom-bar">

                    <button id="changedp" onClick={this.changeDpBtnClick}><i className="fa fa-image fa-fw" aria-hidden="true"></i>
                        <span>change DP</span></button>

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

