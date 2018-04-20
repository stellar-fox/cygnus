import { createReducer } from "../lib/utils"




// StellarAccount state
const initState = {}




// ...
export const LOAD_STELLAR_ACCOUNT = "StellarAccount/LOAD_STELLAR_ACCOUNT"
export const RESET_STATE = "@StellarAccount/RESET_STATE"



// ...
export const action = {

    // ...
    loadStellarAccount: (account) => ({
        type: LOAD_STELLAR_ACCOUNT,
        account,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE, }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [LOAD_STELLAR_ACCOUNT]: (state, action) => ({
        ...state,
        sequence: action.account.sequence,
        accountId: action.account.account_id,
        balance: action.account.balances.find((current) =>
            (current.asset_type === "native")).balance,
        assets: action.account.balances.filter((current) =>
            (current.asset_type !== "native")),
    }),


    // ...
    [RESET_STATE]: () => initState,

})
