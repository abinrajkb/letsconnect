import React from 'react'
import Chat from './containers/Chat'
import Login from './containers/Login'
import { HashRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { authCheckState } from '../src/store/actions/auth'
import { checkChat } from '../src/store/actions/chat'
import Sidepanel from './containers/Sidepanel'


class App extends React.Component {

    componentDidMount() {
        this.props.authCheckState()
        this.props.checkChat()
    }

    render() {
        return (
            <Router>
                {this.props.routingState.token ?
                    <div id="chat">
                        <div id="frame">
                            <Sidepanel />
                            <div className="content">
                                <Route exact path="/" component={Chat} />
                            </div>
                        </div>
                    </div>

                    :
                    <Route path="/" component={Login} />
                }
            </Router>
        )
    }
}

const mapStateToProps = state => ({
    routingState: state.auth
})

export default connect(mapStateToProps, { authCheckState, checkChat })(App)