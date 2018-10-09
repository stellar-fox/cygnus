import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"




// <Account> component state
const initState = {
    firstName: string.empty(),
    lastName: string.empty(),
    email: string.empty(),
    gravatar: string.empty(),
    paymentAddress: string.empty(),
    memo: string.empty(),
    discoverable: true,
    currency: "eur",
    exists: false,
    tabSelected: "Settings",
    needsRegistration: false,
    messageUserData: string.empty(),
    messagePaymentData: string.empty(),
    fingerprintUserData: string.empty(),
    fingerprintPaymentData: string.empty(),
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
