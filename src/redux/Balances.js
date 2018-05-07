import { createReducer } from "../lib/utils"
import { securityMsgPlaceholder, } from "../../src/components/StellarFox/env"



// <Balances> component state
const initState = ((now) => ({
    amount: "",
    amountNative: "",
    amountText: "",
    amountIsValid: false,
    cancelEnabled: true,
    error: "",
    indicatorMessage: securityMsgPlaceholder,
    indicatorStyle: "fade",
    ledgerId: null,
    memoRequired: false,
    memoText: "",
    memoDisabled: false,
    payeeMemoText: "",
    message: null,
    minimumReserveMessage: "",
    newAccount: false,
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
