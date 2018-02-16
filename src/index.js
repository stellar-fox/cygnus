import React from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import { createLogger } from "redux-logger"
import thunk from "redux-thunk"
import reducers from "./reducers"
import {
    unregister,
    // registerServiceWorker,
} from "./registerServiceWorker"
import { loadState, saveState } from "./lib/StatePersistence"
import throttle from "lodash/throttle"
import Layout from "./components/Layout/Layout"

import "./index.css"

const store = createStore(
    reducers,
    loadState(),
    applyMiddleware(thunk, createLogger())
)

store.subscribe(
    throttle(() => {
        saveState(store.getState())
    }, 1000)
)

ReactDOM.render(
    <Provider store={store}>
        <Layout />
    </Provider>,
    document.getElementById("root")
)

// registerServiceWorker()
unregister()
