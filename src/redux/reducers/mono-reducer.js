import { ActionConstants } from "../actions"




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
    cards: {},
}, {
    [ActionTypes.CHANGE_MODAL_STATE] (state, action) {
        // state = Object.assign(...state, action.payload)
        state = {
            ...state,
            modals: Object.assign(action.payload),
        }
        // state = Object.assign(...state, state.modals || {}, action.payload)
        return state
    },
    [ActionTypes.CHANGE_SNACKBAR_STATE] (state, action) {
        state = {
            ...state,
            snackbar: Object.assign(action.payload),
        }
        // state = Object.assign(...state, action.payload)
        return state
    },
    [ActionTypes.TOGGLE_PAYMENT_CARD] (state, action) {
        state = {
            ...state,
            cards: Object.assign(action.payload),
        }
        // state = Object.assign(...state, action.payload)
        return state
    },
})
