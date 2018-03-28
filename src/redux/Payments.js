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

    tabSelected: "1",

}




// ...
export const SET_PAYMENTS_STATE = "SET_PAYMENTS_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_PAYMENTS_STATE,
        payload: state,
    }),

}




// ...
export const reducer = (state = initState, action) => (
    (fs) =>
        action.type in fs ?
            fs[action.type](state, action) :
            state
)({
    [SET_PAYMENTS_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),
})
