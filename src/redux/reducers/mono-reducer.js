import { ActionConstants } from "../actions"




// ...
const ActionTypes = {
    CHANGE_LOGIN_STATE: "CHANGE_LOGIN_STATE",
    SET_HW_PARAMS: "SET_HW_PARAMS",
    SET_PUBKEY: "SET_PUBKEY",
    CHANGE_MODAL_STATE: "CHANGE_MODAL_STATE",
    CHANGE_SNACKBAR_STATE: "CHANGE_SNACKBAR_STATE",
}




// ...
const createReducer = (initState = {}, handlers) =>
    (state = initState, action) => {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }




// ...
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




// ...
export const uiReducer = createReducer({
    modals: {},
    snackbar: {
        open: false,
        message: "",

    },
}, {
    [ActionTypes.CHANGE_MODAL_STATE] (state, action) {
        state = Object.assign(...state, action.payload)
        return state
    },
    [ActionTypes.CHANGE_SNACKBAR_STATE] (state, action) {
        state = Object.assign(...state, action.payload)
        return state
    },
})
