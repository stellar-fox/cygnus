import { createReducer } from "../lib/utils"
import { getSoftwareVersion as ledgerGetSoftwareVersion } from "../lib/ledger"




// LedgerHQ state
const initState = {
    connected: false,
    version: "unknown",
    status: "",
    publicKey: null,
    bip32Path: null,
}




// ...
export const SET_STATE = "LedgerHQ/SET_STATE"
export const RESET_STATE = "LedgerHQ/RESET_STATE"
export const SET_SOFTWARE_VERSION = "LedgerHQ/SET_SOFTWARE_VERSION"
export const SET_PUBLIC_KEY = "LedgerHQ/SET_PUBLIC_KEY"
export const SET_BIP32_PATH = "LedgerHQ/SET_BIP32_PATH"
export const SET_CONNECTED = "LedgerHQ/SET_CONNECTED"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE, }),


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
    setPublicKey: (publicKey) => ({
        type: SET_PUBLIC_KEY,
        publicKey,
    }),


    // ...
    setBip32Path: (bip32Path) => ({
        type: SET_BIP32_PATH,
        bip32Path,
    }),


    // ...
    getSoftwareVersion: () =>
        async (dispatch, _getState) => {
            let version = null
            try {
                dispatch(action.setSoftwareVersion())
                dispatch(action.setConnected(false))
                version = await ledgerGetSoftwareVersion()
                dispatch(action.setSoftwareVersion(version))
                dispatch(action.setConnected(true))
                return version
            } catch (ex) {
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
        ...action.state,
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
    [SET_PUBLIC_KEY]: (state, action) => ({
        ...state,
        publicKey: action.publicKey,
    }),


    // ...
    [SET_BIP32_PATH]: (state, action) => ({
        ...state,
        bip32Path: action.bip32Path,
    }),


})
