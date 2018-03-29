import { createReducer } from "../lib/utils"




// <ASSETS> component state
const initState = {
    rates: [],
    preferredCurrency: "eur",
    foo: null,
}




// ...
export const SET_ASSET_MANAGER_STATE = "SET_ASSET_MANAGER_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_ASSET_MANAGER_STATE,
        payload: state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    [SET_ASSET_MANAGER_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),

})
