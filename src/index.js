import React from "react"
import ReactDOM from "react-dom"
import { unregister } from "./lib/caching-service-worker"

import StellarFox, { env } from "./components/StellarFox"




// render application's root into the DOM
ReactDOM.render(
    React.createElement(StellarFox),
    document.getElementById(env.appRootDomId)
)




// https://bit.ly/oocache
unregister()
