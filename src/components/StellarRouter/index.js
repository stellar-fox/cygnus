import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    Switch,
    Route,
} from "react-router-dom"
import hoistStatics from "hoist-non-react-statics"
import resolvePathname from "resolve-pathname"
import {
    findDuplicates,
    string,
    swap,
} from "@xcmats/js-toolbox"

import {
    CALL_HISTORY_METHOD,
    ConnectedRouter as Router,
    push,
} from "react-router-redux"
import { action as StellarRouterAction } from "../../redux/StellarRouter"

import { env } from "../StellarFox"




// checks if provided 'path' starts with '/'
export const isAbsolute = (path) =>
    path ? path.startsWith("/") : false




// check if provided path ends with '/'
export const hasTrailingSlash = (path) =>
    path ? path.endsWith("/") : false




// returns path which always end with '/'
export const ensureTrailingSlash = (path) =>
    path ?
        (hasTrailingSlash(path) ? path : path + "/") :
        path




// if fed by some 'base' then returned function is 'relative resolve'
// this 'relative resolve' always returns path with ending '/'
export const resolvePath = (base) => (path) =>
    resolvePathname(path, base ? ensureTrailingSlash(base) : base)




// redux-connected <Switch>
export const ConnectedSwitch = connect(
    (state) => ({ location: state.Router.location, })
)(Switch)




// react's context for <StaticRouter>
const StaticRouterContext = React.createContext({})




// <StaticRouter> component
export const StaticRouter = connect(
    // map state to props.
    null,
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        addStaticPaths: StellarRouterAction.addStaticPaths,
        getStatics: StellarRouterAction.getStatics,
        push,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            addStaticPaths: PropTypes.func.isRequired,
            getStatics: PropTypes.func.isRequired,
            push: PropTypes.func.isRequired,
        }


        // ...
        state = { initialized: false, }


        // ...
        componentDidMount = () => {
            let { staticPaths, pathToView, } = this.props.getStatics()
            this._staticPaths = { ...this._staticPaths, ...staticPaths, }
            this._pathToViewMap = { ...this._pathToViewMap, ...pathToView, }
        }


        // takes static path and returns associated view name
        static getView = (path, map) => path in map ? map[path] : string.empty()


        // takes view name and returns stored static path
        getPath = (viewName, fallback = env.appBasePath) =>
            viewName in this._staticPaths ?
                this._staticPaths[viewName] :
                fallback


        // following properties are meant to be mutable and
        // they are intentionally not obeying react's lifecycle rules
        // (thus they are not put into this.state or redux's store)
        _staticPaths = {}
        _pathToViewMap = {}


        // check for all possible (and not wanted) duplicates
        duplicates = (paths) => {
            let
                valDuplicates = findDuplicates(Object.values(paths)),
                keyOverlaps = null,
                swappedPaths = null,
                valOverlaps = null

            if (valDuplicates.length) { return valDuplicates }

            keyOverlaps = findDuplicates([
                ...Object.keys(paths),
                ...Object.keys(this._staticPaths),
            ]).filter((k) => paths[k] !== this._staticPaths[k])

            if (keyOverlaps.length) { return keyOverlaps }

            swappedPaths = swap(paths)

            valOverlaps = findDuplicates([
                ...Object.keys(swappedPaths),
                ...Object.keys(this._pathToViewMap),
            ]).filter((v) => swappedPaths[v] !== this._pathToViewMap[v])

            if (valOverlaps.length) { return valOverlaps }

            return []
        }


        // whenever new set of static paths are added
        // a new path-to-view mapping is computed
        addPaths = (paths) => {
            let duplicates = this.duplicates(paths)
            if (duplicates.length) {
                throw new Error(
                    "A following duplicates found: " +
                    duplicates.join(", ")
                )
            }
            this._staticPaths = { ...this._staticPaths, ...paths, }
            this._pathToViewMap = swap(this._staticPaths)
            this.props.addStaticPaths(paths)
            return this._staticPaths
        }


        // convenience method
        pushByView = (viewName) => this.props.push(this.getPath(viewName))


        // ...
        render = () => (
            (
                { addPaths, getPath, pushByView, },
                { children, push, }
            ) =>
                React.createElement(StaticRouterContext.Provider, {
                    value: { addPaths, getPath, push, pushByView, },
                }, children)
        )(this, this.props)

    }
)




// <StellarRouter> component
export const StellarRouter =
    ({ children, ...restOfTheProps }) =>
        React.createElement(Router, restOfTheProps,
            React.createElement(StaticRouter, null, children)
        )




// <withStaticRouter(...)> HOC
// provides the same props as 'withRouter' HOC
// and additionally a 'staticRouter' prop)
export const withStaticRouter = (WrappedComponent) => {

    let
        // ...
        WithStaticRouter = hoistStatics(
            class extends Component {

                // ...
                static propTypes = {
                    forwardedRef: PropTypes.func,
                }

                // ...
                render = () => (
                    ({ forwardedRef, ...restOfTheProps }) =>
                        React.createElement(Route, null,
                            (routeComponentProps) =>
                                React.createElement(
                                    StaticRouterContext.Consumer, null,
                                    (staticRouter) =>
                                        React.createElement(
                                            WrappedComponent, {
                                                ...restOfTheProps,
                                                ...routeComponentProps,
                                                ref: forwardedRef,
                                                staticRouter,
                                            }
                                        )
                                )
                        )
                )(this.props)

            },
            WrappedComponent
        ),

        // ...
        forwardRef = (props, ref) =>
            React.createElement(WithStaticRouter,
                { ...props, forwardedRef: ref, }
            )

    // ...
    forwardRef.displayName =
        `withStaticRouter(${
            WrappedComponent.displayName || WrappedComponent.name
        })`

    // ...
    forwardRef.WrappedComponent = WrappedComponent

    // ...
    return React.forwardRef(forwardRef)

}




// HOC binding 'currentPath' and 'currentView'
// from application's redux state Router
export const withDynamicRoutes = connect(
    (state) => ({
        currentPath: state.Router.location.pathname,
        currentView: state.Router.currentView,
    }),
)




// Reimplementation of routerMiddleware from "react-router-redux" package,
// not swallowing CALL_HISTORY_METHOD action
// (time-travel / replay experiments).
export function routerMiddleware (history) {
    return () => next => action => {
        if (action.type === CALL_HISTORY_METHOD) {
            const { payload: { method, args, }, } = action
            history[method](...args)
        }
        return next(action)
    }
}
