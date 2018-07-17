import { createReducer } from "@xcmats/js-toolbox"

import { config } from "../../src/config"




// StellarAccount state
const initState = {
    horizon: config.horizon,
}




// ...
export const LOAD_STELLAR_ACCOUNT = "StellarAccount/LOAD_STELLAR_ACCOUNT"
export const SET_PAYMENTS = "StellarAccount/SET_PAYMENTS"
export const SET_TRANSACTIONS = "StellarAccount/SET_TRANSACTIONS"
export const SET_STATE = "@StellarAccount/SET_STATE"
export const RESET_STATE = "@StellarAccount/RESET_STATE"
export const SET_HORIZON = "StellarAccount/SET_HORIZON"




// ...
export const action = {

    // ...
    loadStellarAccount: (account) => ({
        type: LOAD_STELLAR_ACCOUNT,
        account,
    }),


    // ...
    setPayments: (payments) => ({
        type: SET_PAYMENTS,
        payments,
    }),


    // ...
    setTransactions: (transactions) => ({
        type: SET_TRANSACTIONS,
        transactions,
    }),


    // ...
    setHorizon: (horizon) => ({
        type: SET_HORIZON,
        horizon,
    }),

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
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
        homeDomain: action.account.home_domain ?
            action.account.home_domain : null,
        data: action.account.data_attr ? action.account.data_attr : null,
        subentryCount: action.account.subentry_count,
        signers: action.account.signers,
    }),


    // ...
    [SET_PAYMENTS]: (state, action) => ({
        ...state,
        payments: action.payments,
    }),


    // ...
    [SET_TRANSACTIONS]: (state, action) => ({
        ...state,
        transactions: action.transactions,
    }),


    // ...
    [SET_HORIZON]: (state, action) => ({
        ...state,
        horizon: action.horizon,
    }),


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

    
    // ...
    [RESET_STATE]: () => initState,

})
