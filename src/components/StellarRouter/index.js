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
        stellarRouter: PropTypes.object,
    }


    // ...
    getChildContext = () => ({
        stellarRouter: {
            basePath: appBasePath,
            routes: {},
        },
    })


    // ...
    render = () => <Router {...this.props} />

}
