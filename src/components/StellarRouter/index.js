import { connect } from "react-redux"
import { Switch } from "react-router-dom"
import resolvePathname from "resolve-pathname"
import { CALL_HISTORY_METHOD } from "react-router-redux"




// ...
export const isAbsolute = (path) => path.startsWith("/")


// ...
export const hasTrailingSlash = (path) => path.endsWith("/")


// ...
export const ensureTrailingSlash = (path) =>
    hasTrailingSlash(path) ? path : path + "/"


// ...
export const resolvePath = (base) => (path) =>
    resolvePathname(path, base ? ensureTrailingSlash(base) : base)




// ...
export const ConnectedSwitch = connect(
    (state) => ({ location: state.router.location, })
)(Switch)




/**
 *  Reimplementation of routerMiddleware from "react-router-redux" package,
 *  not swallowing CALL_HISTORY_METHOD action.
 *
 *  Time-travel / replay experiments.
 */
export function routerMiddleware (history) {
    return () => next => action => {
        if (action.type === CALL_HISTORY_METHOD) {
            const { payload: { method, args, }, } = action
            history[method](...args)
        }
        return next(action)
    }
}
