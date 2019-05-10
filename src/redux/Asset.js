import { createReducer } from "@xcmats/js-toolbox"



// ...
const initState = {}



// ...
export const SET_STATE = "@Asset/SET_STATE"
export const RESET_STATE = "@Asset/RESET_STATE"




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
