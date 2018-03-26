import {
    handleException,
    nullToUndefined,
} from "./utils"
import { ssAppStateKey } from "../components/StellarFox/env"




// Persists current state of the application (see src/index.js)
export const saveState = (state) =>
    handleException(
        () => sessionStorage.setItem(ssAppStateKey, JSON.stringify(state)),
        // eslint-disable-next-line no-console
        console.log
    )




// When the page is reloaded, current Redux state is restored
// from the sessionStorage.
export const loadState = () =>
    handleException(
        () => nullToUndefined(
            JSON.parse(sessionStorage.getItem(ssAppStateKey))
        ),
        // eslint-disable-next-line no-console
        (ex) => nullToUndefined(console.log(ex))
    )
