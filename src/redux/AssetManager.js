import { createReducer } from "@xcmats/js-toolbox"




// <AssetManager> component state
const initState = {
    loading: false,
    awaitingTrust: [],
    awaitingSignature: [],
}




// ...
export const SET_STATE = "@AssetManager/SET_STATE"
export const RESET_STATE = "@AssetManager/RESET_STATE"




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
