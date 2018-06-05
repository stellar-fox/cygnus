import { createReducer } from "@xcmats/js-toolbox"




// <Account> component state
const initState = {
    firstName: "",
    lastName: "",
    email: "",
    gravatar: "",
    paymentAddress: "",
    memo: "",
    discoverable: true,
    currency: "eur",
    exists: false,
    tabSelected: "Settings",
    needsRegistration: false,
    messageUserData: "",
    messagePaymentData: "",
    fingerprintUserData: "",
    fingerprintPaymentData: "",
}




// ...
export const SET_STATE = "@Account/SET_STATE"
export const RESET_STATE = "@Account/RESET_STATE"




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

})
