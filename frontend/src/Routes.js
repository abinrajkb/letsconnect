import React, { Component } from 'react'
import { Route } from "react-router-dom";
import Chat from './containers/Chat'
import Hoc from './hoc/Hoc'

export class Routes extends Component {
    render() {
        return (
            <div>
                <Route exact path="/:chatID/" component={Chat} />
            </div>
        )
    }
}

export default Routes
