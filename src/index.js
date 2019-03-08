import React from "react"
import ReactDOM from "react-dom"
import { unregister } from "./lib/caching-service-worker"
import createHistory from "history/createBrowserHistory"
import StellarFox, { env } from "./components/StellarFox"
import {
    applyMiddleware,
    createStore,
    combineReducers,
} from "redux"
import thunk from "redux-thunk"
import {
    composeWithDevTools as composeWithDevTools_prod
} from "redux-devtools-extension/developmentOnly"
import {
    composeWithDevTools as composeWithDevTools_dev
} from "redux-devtools-extension"
import { devEnv } from "@xcmats/js-toolbox"

import throttle from "lodash/throttle"
import {
    loadState,
    saveState,
} from "./lib/state-persistence"
import reducers from "./redux"
import { routerMiddleware } from "../src/components/StellarRouter"
import {
    setLoading,
    setScreenDimensions
} from "./thunks/main"




window.addEventListener("load", () => {
    
    const history = createHistory({ /* basename: env.appBasePath, */ })

    const store = (() => {
        let
            composeWithDevTools = !devEnv() ?
                composeWithDevTools_prod : composeWithDevTools_dev,
            s =
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


    // add available window-dimensions event listener
    window.addEventListener(
        "resize",
        () => store.dispatch(setScreenDimensions())
    )


    // surface page loading spinner while everything else finishes loading
    store.dispatch(setLoading())


    // render application's root into the DOM
    ReactDOM.render(
        React.createElement(StellarFox, {history, store}),
        document.getElementById(env.appRootDomId)
    )


    // https://bit.ly/oocache
    unregister()

})
