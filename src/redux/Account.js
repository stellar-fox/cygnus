import { createReducer } from "../lib/utils"




// <Account> component state
const initState = {
    firstName: "",
    lastName: "",
    email: "",
    paymentAddress: "",
    discoverable: true,
    currency: "eur",
    exists: false,
    tabSelected: "Settings",
}




// ...
export const SET_STATE = "@Account/SET_STATE"
export const LOAD_ACCOUNT = "@Account/LOAD_ACCOUNT"
export const RESET_STATE = "@Account/RESET_STATE"



// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        payload: state,
    }),

    // ...
    loadAccount: (account) => ({
        type: LOAD_ACCOUNT,
        payload: {
            sequence: account.sequence,
            account_id: account.account_id,
        },
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
        ...action.payload,
    }),


    // ...
    [LOAD_ACCOUNT]: (state, action) => ({
        ...state,
        stellar: action.payload,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
