/*
 * This persists current state of the application. When the page is reloaded
 * the current Redux state is restored from the sessionStorage. Redux state
 * is saved in index.js.
*/

import {
    handleException,
    nullToUndefined,
} from "./utils"

import { ssAppStateKey } from "../env"




// ...
export const loadState = () =>
    handleException(
        () => nullToUndefined(
            JSON.parse(sessionStorage.getItem(ssAppStateKey))
        ),
        // eslint-disable-next-line no-console
        (ex) => nullToUndefined(console.log(ex))
    )


// ...
export const saveState = (state) =>
    handleException(
        () => sessionStorage.setItem(ssAppStateKey, JSON.stringify(state)),
        // eslint-disable-next-line no-console
        console.log
    )
