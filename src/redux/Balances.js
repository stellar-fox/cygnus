import { createReducer } from "../lib/utils"




// <Balances> component state
const initState = ((now) => ({
    amount: "",
    amountNative: "",
    amountText: "",
    amountIsValid: false,
    cancelEnabled: true,
    error: "",
    indicatorMessage: "XXXXXXXXXXXX",
    indicatorStyle: "fade-extreme",
    ledgerId: null,
    memoRequired: false,
    memoText: "",
    message: null,
    minimumReserveMessage: "",
    newAccount: false,
    payCardVisible: false,
    payDate: now,
    payee: null,
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
