import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"
import { securityMsgPlaceholder } from "../../src/components/StellarFox/env"




// <Balances> component state
const initState = ((now) => ({
    amount: string.empty(),
    amountNative: string.empty(),
    amountText: string.empty(),
    amountIsValid: false,
    cancelEnabled: true,
    contactId: null,
    contactType: string.empty(),
    error: string.empty(),
    indicatorMessage: securityMsgPlaceholder,
    indicatorStyle: "fade",
    ledgerId: null,
    memoRequired: false,
    memoText: string.empty(),
    payeeCurrency: "eur",
    payeeCurrencyAmount: string.empty(),
    payeeMemoText: string.empty(),
    message: null,
    newAccount: false,
    fundCardVisible: false,
    payCardVisible: false,
    payDate: now,
    payee: null,
    payeeStellarAccount: null,
    payeeAddress: string.empty(),
    payeeEmailMD5: string.empty(),
    payeeFullName: string.empty(),
    paymentId: null,
    sendEnabled: false,
    today: now,
    transactionType: null,
    transactionAsset: null,
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
