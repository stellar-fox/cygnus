import {
    createReducer,
    emptyString,
} from "@xcmats/js-toolbox"




// <Account> component state
const initState = {
    firstName: emptyString(),
    lastName: emptyString(),
    email: emptyString(),
    gravatar: emptyString(),
    paymentAddress: emptyString(),
    memo: emptyString(),
    discoverable: true,
    currency: "eur",
    exists: false,
    tabSelected: "Settings",
    needsRegistration: false,
    messageUserData: emptyString(),
    messagePaymentData: emptyString(),
    fingerprintUserData: emptyString(),
    fingerprintPaymentData: emptyString(),
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
