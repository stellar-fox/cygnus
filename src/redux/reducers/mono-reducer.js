import { ActionConstants } from "../actions"
import { createReducer } from "../../lib/utils"




// ...
export const ActionTypes = {
    CHANGE_LOGIN_STATE: "CHANGE_LOGIN_STATE",
    SET_HW_PARAMS: "SET_HW_PARAMS",
    SET_PUBKEY: "SET_PUBKEY",
    CHANGE_MODAL_STATE: "CHANGE_MODAL_STATE",
    CHANGE_SNACKBAR_STATE: "CHANGE_SNACKBAR_STATE",
    TOGGLE_PAYMENT_CARD: "TOGGLE_PAYMENT_CARD",
    RESET_UI_STATE: "MonoReducer/RESET_UI_STATE",
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
const uiInitState = {
    modals: {},
    snackbar: {
        open: false,
        message: "",
    },
    cards: {},
}




// ...
export const uiReducer = createReducer(uiInitState)({

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

    // ...
    [ActionTypes.RESET_UI_STATE]: () => uiInitState,

})
