import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"


// <Payments> component state
const initState = {


    page: 0, // current "page" of data (we will operate on 5 rows pages - for now)
    cursorRight: null, // cursor to use when fetching consecutive page of data


    paymentDetails: {
        txid: null,
        created_at: null,
        memo: string.empty(),
        effects: [],
        selectedPaymentId: null,
    },

    savedTxDetails: null,

    cursorLeft: null,

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
export const SET_CURSOR_RIGHT = "@Payments/SET_CURSOR_RIGHT"



// ...
export const action = {

    // ...
    setCursorRight: (cursorRight) => (dispatch, _getState) =>
        dispatch(action.setState({ cursorRight })),

    // ...
    setPage: (page) => (dispatch, _getState) =>
        dispatch(action.setState({ page })),

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

    // ...
    resetState: () => ({ type: RESET_STATE }),

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
