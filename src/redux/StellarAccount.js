import { createReducer } from "../lib/utils"




// StellarAccount state
const initState = {

}




// ...
export const LOAD_ACCOUNT = "StellarAccount/SET_STATE"




// ...
export const action = {

    // ...
    loadAccount: (account) => ({
        type: LOAD_ACCOUNT,
        payload: account,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [LOAD_ACCOUNT]: (state, action) => ({
        ...state,
        sequence: action.payload.sequence,
        accountId: action.payload.account_id,
        balance: action.payload.balances.find((current) =>
            (current.asset_type === "native")).balance ,
    }),

})
