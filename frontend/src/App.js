import React, { Fragment } from 'react'
import Chat from './containers/Chat'
import Profile from './containers/Profile'
import Login from './containers/Login'
import Routes from './Routes'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { authCheckState } from '../src/store/actions/auth'
import Sidepanel from './containers/Sidepanel'


class App extends React.Component {

    componentDidMount() {
        this.props.authCheckState()
    }

    render() {
        return (
            <Router>
                {/* <Switch> */}
                {this.props.routingState.token ?
                    <div id="chat">
                        <div id="frame">
                            <Sidepanel />
                            <div className="content">
                                <Profile />
                                <Routes />
                            </div>
                        </div>
                    </div>

                    :
                    <Route path="/" component={Login} />
                }
                {/* </Switch> */}
            </Router>
        )
    }
}

const mapStateToProps = state => ({
    routingState: state
})

export default connect(mapStateToProps, { authCheckState })(App)