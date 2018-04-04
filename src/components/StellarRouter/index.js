import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Switch, Route, } from "react-router-dom"
import hoistStatics from "hoist-non-react-statics"
import {
    CALL_HISTORY_METHOD,
    ConnectedRouter as Router,
} from "react-router-redux"
import { action as StellarRouterAction } from "../../redux/StellarRouter"
import resolvePathname from "resolve-pathname"
import { swap } from "../../lib/utils"
import { appBasePath } from "../StellarFox/env"




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
    (state) => ({
        currentPath: state.Router.location.pathname,
        currentView: state.Router.currentView,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        addStaticPaths: StellarRouterAction.addStaticPaths,
        setCurrentView: StellarRouterAction.setCurrentView,
    }, dispatch)
)(
    class StaticRouter extends Component {

        // ...
        static propTypes = {
            currentPath: PropTypes.string.isRequired,
            currentView: PropTypes.string.isRequired,
            addStaticPaths: PropTypes.func.isRequired,
            setCurrentView: PropTypes.func.isRequired,
        }


        // following properties are meant to be mutable and
        // they are intentionally not obeying react's lifecycle rules
        // (thus they are not put into this.state or redux's store)
        _staticPaths = {}
        _pathToViewMap = {}


        // whenever new set of static paths are added
        // a new path-to-view mapping is computed
        addStaticPaths = (paths) => {
            this.props.addStaticPaths(paths)
            this._staticPaths = { ...this._staticPaths, ...paths, }
            this._pathToViewMap = swap(this._staticPaths)

            let newView = this.getViewName(this.props.currentPath)

            if (this.props.currentView !== newView) {
                this.props.setCurrentView(newView)
            }

            return this._staticPaths
        }


        // takes view name and returns stored static path
        getStaticPath = (viewName) =>
            viewName in this._staticPaths ?
                this._staticPaths[viewName] :
                appBasePath


        // takes static path and returns associated view name
        getViewName = (path) =>
            path in this._pathToViewMap ?
                this._pathToViewMap[path] :
                ""


        render = () => (
            ({ addStaticPaths, getStaticPath, getViewName, }, { children, }) =>
                React.createElement(
                    StaticRouterContext.Provider,
                    {
                        value: {
                            addStaticPaths,
                            getStaticPath,
                            getViewName,
                        },
                    },
                    children
                )
        )(this, this.props)

    }
)




// <StellarRouter> component
export const StellarRouter = ({ children, ...restOfTheProps }) =>
    React.createElement(
        Router,
        restOfTheProps,
        React.createElement(
            StaticRouter,
            null,
            children
        )
    )




// <withStellarRouter(...)> HOC
// provides 'stellarRouter' and all '<Route>' props to wrapped component
// (in other words, provides exactly the same props as 'withRouter' HOC
// and additionally a 'stellarRouter' prop)
export const withStellarRouter = (WrappedComponent) =>
    hoistStatics(
        class WithStellarRouter extends Component {

            // ...
            static propTypes = {
                wrappedComponentRef: PropTypes.func,
            }

            // ...
            static displayName =
                `withStellarRouter(${
                    WrappedComponent.displayName || WrappedComponent.name
                })`

            // ...
            static WrappedComponent = WrappedComponent

            // ...
            render = () => (
                ({ wrappedComponentRef, ...restOfTheProps }) =>
                    React.createElement(
                        Route,
                        {
                            children: (routeComponentProps) =>
                                React.createElement(
                                    StaticRouterContext.Consumer,
                                    null,
                                    (stellarRouter) =>
                                        React.createElement(WrappedComponent, {
                                            ...restOfTheProps,
                                            ...routeComponentProps,
                                            ref: wrappedComponentRef,
                                            stellarRouter,
                                        })
                                ),
                        }
                    )
            )(this.props)

        },
        WrappedComponent
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
