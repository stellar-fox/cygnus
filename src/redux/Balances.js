import { createReducer } from "../lib/utils"




// <Balances> component state
const initState = {
    today: new Date(),
}




// ...
export const SET_BALANCES_STATE = "SET_BALANCES_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_BALANCES_STATE,
        payload: state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    [SET_BALANCES_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),

})
