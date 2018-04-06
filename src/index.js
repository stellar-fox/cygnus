import React from "react"
import ReactDOM from "react-dom"
import { unregister } from "./lib/registerServiceWorker"
import { appRootDomId } from "./components/StellarFox/env"
import StellarFox from "./components/StellarFox"




// render application's root into the DOM
ReactDOM.render(
    React.createElement(StellarFox),
    document.getElementById(appRootDomId)
)




// http://bit.ly/oocache
unregister()
