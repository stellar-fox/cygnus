import { createReducer } from "../lib/utils"
import { getSoftwareVersion } from "../lib/ledger"




// LedgerHQ state
const initState = {
    connected: false,
    version: "unknown",
    status: "idle",
}




// ...
export const SET_STATE = "LedgerHQ/SET_STATE"
export const SET_SOFTWARE_VERSION = "LedgerHQ/SET_SOFTWARE_VERSION"
export const SET_CONNECTED = "LedgerHQ/SET_CONNECTED"
export const SET_STATUS = "LedgerHQ/SET_STATUS"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    setConnected: (state) => ({
        type: SET_CONNECTED,
        state,
    }),


    // ...
    setSoftwareVersion: (version="unknown") => ({
        type: SET_SOFTWARE_VERSION,
        version,
    }),


    // ...
    setStatus: (status="idle") => ({
        type: SET_STATUS,
        status,
    }),


    // ...
    queryForSoftwareVersion: () =>
        async (dispatch, _getState) => {
            let version = null
            dispatch(action.setStatus("getting version"))
            dispatch(action.setSoftwareVersion())
            dispatch(action.setConnected(false))
            version = await getSoftwareVersion()
            dispatch(action.setSoftwareVersion(version))
            dispatch(action.setConnected(true))
            dispatch(action.setStatus())
            return version
        },

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),


    // ...
    [SET_CONNECTED]: (state, action) => ({
        ...state,
        connected: action.state,
    }),


    // ...
    [SET_SOFTWARE_VERSION]: (state, action) => ({
        ...state,
        version: action.version,
    }),


    // ...
    [SET_STATUS]: (state, action) => ({
        ...state,
        status: action.status,
    }),

})
