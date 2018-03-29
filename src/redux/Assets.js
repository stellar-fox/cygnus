import { createReducer } from "../lib/utils"




// <ASSETS> component state
const initState = {
    firstName: "",
    lastName: "",
    email: "",
    paymentAddress: "",
    discoverable: true,
}




// ...
export const SET_ASSETS_STATE = "SET_ASSETS_STATE"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_ASSETS_STATE,
        payload: state,
    }),

}




// ...
export const reducer = createReducer(initState)({

    [SET_ASSETS_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),

})
