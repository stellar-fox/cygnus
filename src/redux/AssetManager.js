import { createReducer } from "@xcmats/js-toolbox"




// <AssetManager> component state
const initState = {}




// ...
export const SET_STATE = "@AssetManager/SET_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

})
