import { createReducer } from "@xcmats/js-toolbox"




// <Socket> component state
const initState = {
    status: 0,
}




// ...
export const SET_STATE = "@Socket/SET_STATE"
export const RESET_STATE = "@Socket/RESET_STATE"




// ...
export const action = {

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
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
