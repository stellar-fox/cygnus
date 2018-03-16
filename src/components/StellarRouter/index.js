import React, { Component } from "react"
import {
    ConnectedRouter as Router
} from "react-router-redux"




// ...
export default class StellarRouter extends Component {

    // ...
    render = () => <Router {...this.props} />

}
