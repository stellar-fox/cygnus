import { createReducer } from "../lib/utils"




// <Payments> component state
const initState = {

    paymentDetails: {
        txid: null,
        created_at: null,
        memo: "",
        effects: [],
        selectedPaymentId: null,
    },

    cursorLeft: null,
    cursorRight: null,
    prevDisabled: false,
    nextDisabled: false,

    txCursorLeft: null,
    txCursorRight: null,
    txNextDisabled: false,
    txPrevDisabled: false,

    sbPayment: false,
    sbPaymentAmount: null,
    sbPaymentAssetCode: null,
    sbNoMorePayments: false,
    sbNoMoreTransactions: false,

    tabSelected: "History",

}




// ...
export const SET_STATE = "@Payments/SET_STATE"
export const RESET_STATE = "@Payments/RESET_STATE"




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
