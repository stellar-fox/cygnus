import { createReducer } from "../lib/utils"
import { getSoftwareVersion as ledgerGetSoftwareVersion } from "../lib/ledger"




// LedgerHQ state
const initState = {
    connected: false,
    version: "unknown",
    status: "",
}




// ...
export const SET_STATE = "LedgerHQ/SET_STATE"
export const RESET_STATE = "LedgerHQ/RESET_STATE"
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
    resetState: () => ({
        type: RESET_STATE,
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
    setStatus: (status="") => ({
        type: SET_STATUS,
        status,
    }),


    // ...
    getSoftwareVersion: () =>
        async (dispatch, _getState) => {
            let version = null
            try {
                dispatch(action.setStatus("Waiting for device ..."))
                dispatch(action.setSoftwareVersion())
                dispatch(action.setConnected(false))
                version = await ledgerGetSoftwareVersion()
                dispatch(action.setSoftwareVersion(version))
                dispatch(action.setConnected(true))
                dispatch(action.setStatus(`Connected. Version: ${version}`))
                return version
            } catch (ex) {
                dispatch(action.setStatus(`Error: ${ex.message}`))
                dispatch(action.setSoftwareVersion())
                dispatch(action.setConnected(false))
                throw ex
            }
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
    [RESET_STATE]: () => initState,


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
