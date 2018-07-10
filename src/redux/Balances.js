import { createReducer } from "@xcmats/js-toolbox"

import { securityMsgPlaceholder } from "../../src/components/StellarFox/env"




// <Balances> component state
const initState = ((now) => ({
    amount: "",
    amountNative: "",
    amountText: "",
    amountIsValid: false,
    cancelEnabled: true,
    contactId: null,
    contactType: "",
    error: "",
    indicatorMessage: securityMsgPlaceholder,
    indicatorStyle: "fade",
    ledgerId: null,
    memoRequired: false,
    memoText: "",
    payeeCurrency: "eur",
    payeeCurrencyAmount: "",
    payeeMemoText: "",
    message: null,
    newAccount: false,
    fundCardVisible: false,
    payCardVisible: false,
    payDate: now,
    payee: null,
    payeeStellarAccount: null,
    payeeAddress: "",
    paymentId: null,
    sendEnabled: false,
    today: now,
    transactionType: null,
}))(new Date())




// ...
export const SET_STATE = "@Balances/SET_STATE"
export const RESET_STATE = "@Balances/RESET_STATE"




// ...
export const action = {

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
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
