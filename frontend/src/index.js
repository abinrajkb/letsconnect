import React from 'react'
import ReactDOM from 'react-dom'
import webSocketInstance from './websocket'
import { createStore, applyMiddleware } from 'redux'
import reducer from './store/reducers/auth'

import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
const middleware = [thunk]
const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)))

import App from './App'

class Output extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

ReactDOM.render(<Output />, document.getElementById('app'))