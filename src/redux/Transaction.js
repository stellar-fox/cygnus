import { createReducer } from "@xcmats/js-toolbox"




// Transaction state
const initState = {}




// ...
export const SET_TRANSACTION = "@Transaction/SET_TRANSACTION"
export const CLEAR_TRANSACTION = "@Transaction/CLEAR_TRANSACTION"
export const SET_STATE = "@StellarAccount/SET_STATE"
export const RESET_STATE = "@StellarAccount/RESET_STATE"




// ...
export const action = {


    // ...
    setTransaction: (transaction) => ({
        type: SET_TRANSACTION,
        transaction,
    }),


    // ...
    clearTransaction: () => ({
        type: CLEAR_TRANSACTION,
    }),


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
    [SET_TRANSACTION]: (state, action) => ({
        ...state,
        ...action.transaction,
    }),


    // ...
    [CLEAR_TRANSACTION]: () => initState,


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
