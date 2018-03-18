import { ActionConstants } from "../actions"


const ActionTypes = {
    CHANGE_LOGIN_STATE: "CHANGE_LOGIN_STATE",
    SET_HW_PARAMS: "SET_HW_PARAMS",
    SELECT_VIEW: "SELECT_VIEW",
    SET_PUBKEY: "SET_PUBKEY",
    CHANGE_MODAL_STATE: "CHANGE_MODAL_STATE",
}


function createReducer (initState = {}, handlers) {
    return function reducer (state = initState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}


export const authReducer = createReducer({
    loginState: ActionConstants.LOGGED_OUT,
    publicKey: null,
    bip32Path: null,
    userId: null,
    token: null,
}, {
    [ActionTypes.CHANGE_LOGIN_STATE] (state = {}, action) {
        state = Object.assign(...state, action.payload)
        return state
    },
})


export const navReducer = createReducer({}, {
    [ActionTypes.SELECT_VIEW] (state, action) {
        state = { ...state, view: action.payload, }
        return state
    },
})


export const uiReducer = createReducer({
    modals: {},
}, {
    [ActionTypes.CHANGE_MODAL_STATE] (state, action) {
        state = Object.assign(...state, action.payload)
        return state
    },
})