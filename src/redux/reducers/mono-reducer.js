import { ActionConstants } from "../actions"
import { createReducer } from "../../lib/utils"




// ...
const ActionTypes = {
    CHANGE_LOGIN_STATE: "CHANGE_LOGIN_STATE",
    SET_HW_PARAMS: "SET_HW_PARAMS",
    SET_PUBKEY: "SET_PUBKEY",
    CHANGE_MODAL_STATE: "CHANGE_MODAL_STATE",
    CHANGE_SNACKBAR_STATE: "CHANGE_SNACKBAR_STATE",
    TOGGLE_PAYMENT_CARD: "TOGGLE_PAYMENT_CARD",
}




// ...
export const authReducer = createReducer({
    loginState: ActionConstants.LOGGED_OUT,
    publicKey: null,
    bip32Path: null,
    userId: null,
    token: null,
})({

    // ...
    [ActionTypes.CHANGE_LOGIN_STATE]: (state = {}, action) => ({
        ...state,
        ...action.payload,
    }),

})




// ...
export const uiReducer = createReducer({
    modals: {},
    snackbar: {
        open: false,
        message: "",
    },
    cards: {},
})({

    // ...
    [ActionTypes.CHANGE_MODAL_STATE]: (state, action) => ({
        ...state,
        modals: action.payload,
    }),


    // ..
    [ActionTypes.CHANGE_SNACKBAR_STATE]: (state, action) => ({
        ...state,
        snackbar: action.payload,
    }),


    // ...
    [ActionTypes.TOGGLE_PAYMENT_CARD]: (state, action) => ({
        ...state,
        cards: action.payload,
    }),

})
