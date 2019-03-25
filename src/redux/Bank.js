import { createReducer } from "@xcmats/js-toolbox"




// <Bank> component state
const initState = {
    drawerVisible: true,
    signupHintVisible: true,
    streamerPaymentLedOn: false,
    streamerPaymentConnected: false,
    streamerOperationLedOn: false,
    streamerOperationConnected: false,
}




// ...
export const SET_STATE = "@Bank/SET_STATE"
export const RESET_STATE = "@Bank/RESET_STATE"
export const TOGGLE_DRAWER = "@Bank/DRAWER_TOGGLE"
export const TOGGLE_SIGNUP_HINT = "@Bank/TOGGLE_SIGNUP_HINT"
export const TOGGLE_PAYMENT_STREAMER_LED = "@Bank/TOGGLE_PAYMENT_STREAMER_LED"
export const TOGGLE_PAYMENT_STREAMER_CONNECTED = "@Bank/TOGGLE_PAYMENT_STREAMER_CONNECTED"
export const TOGGLE_OPERATION_STREAMER_LED = "@Bank/TOGGLE_OPERATION_STREAMER_LED"
export const TOGGLE_OPERATION_STREAMER_CONNECTED = "@Bank/TOGGLE_OPERATION_STREAMER_CONNECTED"




// ...
export const action = {

    // show/hide bank drawer (see Bank/<BankDrawer> component)
    toggleDrawer: () => ({
        type: TOGGLE_DRAWER,
    }),

    // ...
    toggleSignupHint: (isVisible) => ({
        type: TOGGLE_SIGNUP_HINT,
        isVisible,
    }),

    // ...
    togglePaymentStreamerLed: (on) => ({
        type: TOGGLE_PAYMENT_STREAMER_LED,
        on,
    }),

    // ...
    togglePaymentStreamerConnected: (connected) => ({
        type: TOGGLE_PAYMENT_STREAMER_CONNECTED,
        connected,
    }),

    // ...
    toggleOperationStreamerLed: (on) => ({
        type: TOGGLE_OPERATION_STREAMER_LED,
        on,
    }),

    // ...
    toggleOperationStreamerConnected: (connected) => ({
        type: TOGGLE_OPERATION_STREAMER_CONNECTED,
        connected,
    }),

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

    // ...
    resetState: () => ({ type: RESET_STATE }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [TOGGLE_DRAWER]: (state) => ({
        ...state,
        drawerVisible: !state.drawerVisible,
    }),


    // ...
    [TOGGLE_SIGNUP_HINT]: (state, action) => ({
        ...state,
        signupHintVisible: action.isVisible,
    }),


    // ...
    [TOGGLE_PAYMENT_STREAMER_LED]: (state, action) => ({
        ...state,
        streamerPaymentLedOn: action.on,
    }),


    // ...
    [TOGGLE_PAYMENT_STREAMER_CONNECTED]: (state, action) => ({
        ...state,
        streamerPaymentConnected: action.connected,
    }),


    // ...
    [TOGGLE_OPERATION_STREAMER_LED]: (state, action) => ({
        ...state,
        streamerOperationLedOn: action.on,
    }),


    // ...
    [TOGGLE_OPERATION_STREAMER_CONNECTED]: (state, action) => ({
        ...state,
        streamerOperationConnected: action.connected,
    }),


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
