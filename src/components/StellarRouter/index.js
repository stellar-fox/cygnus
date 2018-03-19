import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import {
    ConnectedRouter as Router
} from "react-router-redux"
import { Switch } from "react-router-dom"
import resolvePathname from "resolve-pathname"




// ...
export const isAbsolute = (path) => path.startsWith("/")


// ...
export const hasTrailingSlash = (path) => path.endsWith("/")


// ...
export const ensureTrailingSlash = (path) =>
    hasTrailingSlash(path) ? path : path + "/"


// ...
export const resolvePath = (base) => (path) =>
    resolvePathname(path, base ? ensureTrailingSlash(base) : base)




// ...
export const ConnectedSwitch = connect(
    (state) => ({ location: state.router.location, })
)(Switch)




// ...
export class StellarRouter extends Component {

    // ...
    static childContextTypes = {
        staticRoutes: PropTypes.object,
    }


    // ...
    getChildContext = () => ({
        staticRoutes: {},
    })


    // ...
    render = () => <Router {...this.props} />

}
