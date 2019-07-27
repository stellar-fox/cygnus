import React from "react"
import ReactDOM from "react-dom"
import { unregister } from "./lib/caching-service-worker"
import { createBrowserHistory } from "history"
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
import {
    devEnv,
    getProcess,
    isObject,
    to_,
} from "@xcmats/js-toolbox"
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
import {
    dynamicImportLibs,
    dynamicImportReducers,
} from "./lib/utils"

// hide main loading spinner the moment custom fonts have loaded
document.fonts.ready.then(
    setTimeout(() => document
        .getElementById("pre-flight-loader")
        .className = "off", 300
    )
)

window.addEventListener("load", () => {

    const history = createBrowserHistory()

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


    // expose 'sf' dev. namespace only in dev. environment
    if (devEnv() && isObject(window)) {
        (async () => {
            window.sf = {
                env, history, store, React,
                dispatch: store.dispatch,
                ...await dynamicImportLibs(),
                process: getProcess(),
                r: await dynamicImportReducers(),
            }
            window.to_ = to_
        })()
    }

    // render application's root into the DOM
    ReactDOM.render(
        React.createElement(StellarFox, {history, store}),
        document.getElementById(env.appRootDomId)
    )


    // https://bit.ly/oocache
    unregister()

})
