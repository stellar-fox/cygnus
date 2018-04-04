import React from "react"
import ReactDOM from "react-dom"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import { routerMiddleware } from "./components/StellarRouter"
import createHistory from "history/createBrowserHistory"
import {
    composeWithDevTools,
} from "redux-devtools-extension"
import throttle from "lodash/throttle"
import { unregister } from "./lib/registerServiceWorker"

import reducers from "./redux/reducers"
import {
    appBasePath,
    appRootDomId,
    ssSaveThrottlingTime,
} from "./components/StellarFox/env"
import {
    loadState,
    saveState,
} from "./lib/statePersistence"

import StellarFox from "./components/StellarFox"




// browser history
const history = createHistory({
    basename: appBasePath,
})


// store with router-redux integration and redux-devtools-extension
const store = createStore(
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
store.subscribe(
    throttle(
        () => saveState(store.getState()),
        ssSaveThrottlingTime
    )
)


// render application's root into the DOM
ReactDOM.render(
    React.createElement(StellarFox, { store, history, }),
    document.getElementById(appRootDomId)
)


// ...
unregister()
