import React from "react"

import { Provider } from "react-redux"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import { isObject } from "@xcmats/js-toolbox"

import throttle from "lodash/throttle"
import createHistory from "history/createBrowserHistory"
import {
    StellarRouter as Router,
    routerMiddleware,
} from "../StellarRouter"

import {
    loadState,
    saveState,
} from "../../lib/state-persistence"
import reducers from "../../redux"
import {
    devEnv,
    dynamicImportLibs,
    dynamicImportReducers,
} from "../../lib/utils"
import * as env from "./env"

import { MuiThemeProvider } from "@material-ui/core/styles"
import sFoxTheme from "../../lib/sfox-mui-theme"
import { CssBaseline } from "@material-ui/core"
import LegacyMuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import sFoxThemeLegacy from "../../lib/sfox-mui-theme.legacy"

import AssetManager from "../AssetManager"
import LoginManager from "../LoginManager"
import Layout from "../Layout"

import "typeface-roboto"
import "./index.css"




// browser history
export const history = createHistory({
    basename: env.appBasePath,
})




// store with router-redux integration and redux-devtools-extension
export const store = (() => {
    let s =
        createStore(
            combineReducers(reducers),
            loadState(),
            composeWithDevTools(
                applyMiddleware(
                    thunk,
                    routerMiddleware(history)
                )
            )
        )

    // save state in session storage in min. 1 sec. intervals
    s.subscribe(
        throttle(
            () => saveState(s.getState()),
            env.ssSaveThrottlingTime
        )
    )

    return s
})()




// <StellarFox> component - application's root
export default () =>
    <Provider store={store}>
        <Router history={history}>
            <MuiThemeProvider theme={sFoxTheme}>
                <LegacyMuiThemeProvider muiTheme={sFoxThemeLegacy}>
                    <LoginManager>
                        <AssetManager>
                            <CssBaseline />
                            <Layout />
                        </AssetManager>
                    </LoginManager>
                </LegacyMuiThemeProvider>
            </MuiThemeProvider>
        </Router>
    </Provider>




// expose 'sf' dev. namespace only in dev. environment
if (devEnv()  &&  isObject(window)) {
    (async () => { window.sf = {
        env, history, store, React,
        dispatch: store.dispatch,
        ...await dynamicImportLibs(),
        process, // eslint-disable-line
        r: await dynamicImportReducers(),
    }})()
}




// ...
export { env }
