import React from "react"
import { Provider } from "react-redux"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import createHistory from "history/createBrowserHistory"
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly"
import throttle from "lodash/throttle"

import LegacyMuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import { MuiThemeProvider } from "material-ui-next/styles"
import CssBaseline from "material-ui-next/CssBaseline"

import {
    StellarRouter as Router,
    routerMiddleware,
} from "../StellarRouter"
import reducers from "../../redux"
import {
    loadState,
    saveState,
} from "../../lib/statePersistence"
import {
    devEnv,
    dynamicImportLibs,
    dynamicImportReducers,
} from "../../lib/utils"
import * as env from "./env"

import LoginManager from "../LoginManager"
import AssetManager from "../AssetManager"
import Layout from "../Layout"

import sFoxTheme from "../../lib/sfox-mui-theme"
import legacySFoxTheme from "../../lib/sfox-mui-theme.legacy"


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
                <LegacyMuiThemeProvider muiTheme={legacySFoxTheme}>
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
if (devEnv()  &&  typeof window !== "undefined") {
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
