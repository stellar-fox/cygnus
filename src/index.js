import React from "react"
import ReactDOM from "react-dom"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import { Provider } from "react-redux"
import createHistory from "history/createBrowserHistory"
import {
    routerReducer,
    routerMiddleware,
} from "react-router-redux"
import {
    composeWithDevTools,
} from "redux-devtools-extension"
import throttle from "lodash/throttle"

import {
    unregister,
    // registerServiceWorker,
} from "./registerServiceWorker"
import reducers from "./reducers"
import {
    appRootDomId,
    ssSaveThrottlingTime,
} from "./env"
import {
    loadState,
    saveState,
} from "./lib/StatePersistence"

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import stellarTheme from "./frontend/themes/stellar"

import { StellarRouter as Router } from  "./components/StellarRouter"
import { appBasePath } from "./env"
import Layout from "./components/Layout"

import "./index.css"




// browser history
const history = createHistory()


// store with router-redux integration and redux-devtools-extension
const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer,
    }),
    loadState(),
    composeWithDevTools(
        applyMiddleware(
            thunk,
            routerMiddleware(history)
        )
    )
)


// save state in session storage in min. 1 sec. intervals
store.subscribe(
    throttle(
        () => saveState(store.getState()),
        ssSaveThrottlingTime
    )
)


// application's root
const StellarFox = () =>
    <Provider store={store}>
        <MuiThemeProvider muiTheme={stellarTheme}>
            <Router history={history}>
                <Layout basePath={appBasePath} />
            </Router>
        </MuiThemeProvider>
    </Provider>


// render application's root into the DOM
ReactDOM.render(
    <StellarFox />,
    document.getElementById(appRootDomId)
)




// ...
// registerServiceWorker()
unregister()
