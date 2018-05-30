import { createReducer } from "@xcmats/js-toolbox"

// <Contacts> component state
const initState = {
    internal: [],
    external: [],
    requests: [],
    details: {
        external: false,
        contact: null,
    },
}




// ...
export const SET_STATE = "@Contacts/SET_STATE"
export const RESET_STATE = "@Contacts/RESET_STATE"




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