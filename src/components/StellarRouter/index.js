import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
    ConnectedRouter as Router
} from "react-router-redux"
import { Switch } from "react-router-dom"
import { appBasePath } from "../../env"




// ...
export const ConnectedSwitch = connect(
    (state) => ({
        location: state.router.location,
    })
)(Switch)




// ...
export class StellarRouter extends Component {

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
