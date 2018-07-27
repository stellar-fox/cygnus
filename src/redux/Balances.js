import {
    createReducer,
    emptyString,
} from "@xcmats/js-toolbox"
import { securityMsgPlaceholder } from "../../src/components/StellarFox/env"




// <Balances> component state
const initState = ((now) => ({
    amount: emptyString(),
    amountNative: emptyString(),
    amountText: emptyString(),
    amountIsValid: false,
    cancelEnabled: true,
    contactId: null,
    contactType: emptyString(),
    error: emptyString(),
    indicatorMessage: securityMsgPlaceholder,
    indicatorStyle: "fade",
    ledgerId: null,
    memoRequired: false,
    memoText: emptyString(),
    payeeCurrency: "eur",
    payeeCurrencyAmount: emptyString(),
    payeeMemoText: emptyString(),
    message: null,
    newAccount: false,
    payCardVisible: false,
    payDate: now,
    payee: null,
    payeeStellarAccount: null,
    payeeAddress: emptyString(),
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
