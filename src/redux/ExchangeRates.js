import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"




// <ExchangeRates> component state
const initState = {
    usd: {
        rate: string.empty(),
        lastUpdated: string.empty(),
    },
    eur: {
        rate: string.empty(),
        lastUpdated: string.empty(),
    },
}




// ...
export const SET_RATE = "@ExchangeRates/SET_RATE"
export const SET_STATE = "@ExchangeRates/SET_STATE"
export const RESET_STATE = "@ExchangeRates/RESET_STATE"




// ...
export const action = {

    // ...
    setRate: (rate) => ({
        type: SET_RATE,
        rate,
    }),


    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    resetState: () => ({
        type: RESET_STATE,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_RATE]: (state, action) => ({
        ...state,
        ...action.rate,
    }),


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
