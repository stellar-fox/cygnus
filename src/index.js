import React from "react"
import ReactDOM from "react-dom"
import {
    createStore,
//    applyMiddleware
} from "redux"
import { Provider } from "react-redux"
import { devToolsEnhancer } from "redux-devtools-extension"
// import { createLogger } from "redux-logger"
// import thunk from "redux-thunk"
import reducer from "./reducers"
import {
    unregister,
    // registerServiceWorker,
} from "./registerServiceWorker"
import throttle from "lodash/throttle"
import { loadState, saveState } from "./lib/StatePersistence"
import Layout from "./components/Layout"

import "./index.css"




// ...
const store = createStore(
    reducer,
    loadState(),
    devToolsEnhancer()
)


// ...
// const store = createStore(
//     reducer,
//     loadState(),
//     applyMiddleware(thunk, createLogger())
// )


// ...
store.subscribe(
    throttle(() => {
        saveState(store.getState())
    }, 1000)
)


// ...
ReactDOM.render(
    <Provider store={store}>
        <Layout />
    </Provider>,
    document.getElementById("app")
)


// registerServiceWorker()
unregister()
