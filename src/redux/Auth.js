import { createReducer } from "@xcmats/js-toolbox"




// ...
const initState = {
    authenticated: false,
}




// ...
export const SET_STATE = "Auth/SET_USER_ID"
export const RESET_STATE = "Auth/RESET_STATE"




// ...
export const action = {

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
