import React, { Component } from "react"
import {
    ConnectedRouter as Router
} from "react-router-redux"
import PropTypes from "prop-types"
import { appBasePath } from "../../env"



// ...
export default class StellarRouter extends Component {

    // ...
    static childContextTypes = {
        routes: PropTypes.object,
    }


    // ...
    getChildContext = () => ({
        routes: {
            basePath: appBasePath,
        },
    })


    // ...
    render = () => <Router {...this.props} />

}
