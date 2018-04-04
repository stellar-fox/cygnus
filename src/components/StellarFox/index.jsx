import React from "react"
import { Provider } from "react-redux"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import createHistory from "history/createBrowserHistory"
import { composeWithDevTools } from "redux-devtools-extension"
import throttle from "lodash/throttle"
import {
    StellarRouter as Router,
    routerMiddleware,
} from "../StellarRouter"
import reducers from "../../redux/reducers"
import {
    loadState,
    saveState,
} from "../../lib/statePersistence"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import LoginManager from "../LoginManager"
import AssetManager from "../AssetManager"
import Layout from "../Layout"
import {
    appBasePath,
    ssSaveThrottlingTime,
} from "../StellarFox/env"
import stellarTheme from "./theme"

import "./index.css"




// browser history
export const appHistory = createHistory({
    basename: appBasePath,
})




// store with router-redux integration and redux-devtools-extension
export const appStore = (() => {
    let s =
        createStore(
            combineReducers(reducers),
            loadState(),
            composeWithDevTools(
                applyMiddleware(
                    thunk,
                    routerMiddleware(appHistory)
                )
            )
        )

    // save state in session storage in min. 1 sec. intervals
    s.subscribe(
        throttle(
            () => saveState(s.getState()),
            ssSaveThrottlingTime
        )
    )

    return s
})()




// <StellarFox> component - application's root
export default () =>
    <Provider store={appStore}>
        <Router history={appHistory}>
            <MuiThemeProvider muiTheme={stellarTheme}>
                <LoginManager>
                    <AssetManager>
                        <Layout />
                    </AssetManager>
                </LoginManager>
            </MuiThemeProvider>
        </Router>
    </Provider>
