import {
    handleException,
    nullToUndefined,
} from "@xcmats/js-toolbox"
import { env } from "../components/StellarFox"




// Persists current state of the application (see src/index.js)
export const saveState = (state) =>
    handleException(
        () => sessionStorage.setItem(env.ssAppStateKey, JSON.stringify(state)),
        // eslint-disable-next-line no-console
        console.log
    )




// When the page is reloaded, current Redux state is restored
// from the sessionStorage.
export const loadState = () =>
    handleException(
        () => nullToUndefined(
            JSON.parse(sessionStorage.getItem(env.ssAppStateKey))
        ),
        // eslint-disable-next-line no-console
        (ex) => nullToUndefined(console.log(ex))
    )
