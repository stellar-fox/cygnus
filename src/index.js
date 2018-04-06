import React from "react"
import ReactDOM from "react-dom"
import StellarFox, { env } from "./components/StellarFox"
import { unregister } from "./lib/registerServiceWorker"




// render application's root into the DOM
ReactDOM.render(
    React.createElement(StellarFox),
    document.getElementById(env.appRootDomId)
)




// https://bit.ly/oocache
unregister()
