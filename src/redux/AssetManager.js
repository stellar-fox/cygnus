import { createReducer } from "../lib/utils"




// <AssetManager> component state
const initState = {}




// ...
export const SET_STATE = "@AssetManager/SET_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        payload: state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),

})
