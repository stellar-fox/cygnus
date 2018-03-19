import { connect } from "react-redux"
import { Switch } from "react-router-dom"
import resolvePathname from "resolve-pathname"




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
