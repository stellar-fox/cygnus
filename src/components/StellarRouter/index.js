import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Switch } from "react-router-dom"
import {
    CALL_HISTORY_METHOD,
    ConnectedRouter as Router,
} from "react-router-redux"
import resolvePathname from "resolve-pathname"

import { action as RouterAction } from "../../redux/StellarRouter"




// ...
export const isAbsolute = (path) =>
    path ? path.startsWith("/") : false


// ...
export const hasTrailingSlash = (path) =>
    path ? path.endsWith("/") : false


// ...
export const ensureTrailingSlash = (path) =>
    path ?
        (hasTrailingSlash(path) ? path : path + "/") :
        path


// ...
export const resolvePath = (base) => (path) =>
    resolvePathname(path, base ? ensureTrailingSlash(base) : base)




// ...
export const ConnectedSwitch = connect(
    (state) => ({ location: state.router.location, })
)(Switch)




// ...
const StellarRouterContext = React.createContext({})




// <StellarRouter> component
export const StellarRouter = connect(
    (state) => ({ paths: state.Router.paths, }),
    (dispatch) => ({ addPaths: (ps) => dispatch(RouterAction.addPaths(ps)), })
)(
    class StellarRouter extends Component {

        // ...
        static propTypes = {
            paths: PropTypes.object.isRequired,
            addPaths: PropTypes.func.isRequired,
        }


        // don't re-render when paths are updated
        shouldComponentUpdate = (nextProps) =>
            nextProps !== this.props  ||
            nextProps.paths === this.props.paths


        // ...
        render = () => (
            ({ paths, addPaths, ...restOfTheProps }) =>
                React.createElement(
                    StellarRouterContext.Provider,
                    { value: { paths, addPaths, }, },
                    React.createElement(Router, restOfTheProps)
                )
        )(this.props)

    }
)




/**
 *  Reimplementation of routerMiddleware from "react-router-redux" package,
 *  not swallowing CALL_HISTORY_METHOD action.
 *
 *  Time-travel / replay experiments.
 */
export function routerMiddleware (history) {
    return () => next => action => {
        if (action.type === CALL_HISTORY_METHOD) {
            const { payload: { method, args, }, } = action
            history[method](...args)
        }
        return next(action)
    }
}
