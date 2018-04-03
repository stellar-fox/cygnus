import { createReducer } from "../lib/utils"




// <StellarRouter> component state
const initState = {

    paths: {},

}




// ...
export const SET_STELLAR_ROUTER_STATE = "SET_STELLAR_ROUTER_STATE"
export const ADD_STATIC_PATHS = "ADD_STATIC_PATHS"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STELLAR_ROUTER_STATE,
        payload: state,
    }),

    // ...
    addPaths: (paths) => ({
        type: ADD_STATIC_PATHS,
        payload: paths,
    }),

}




// ...
export const reducer = createReducer(initState)({

    [SET_STELLAR_ROUTER_STATE]: (state, action) => ({
        ...state,
        ...action.payload,
    }),

    [ADD_STATIC_PATHS]: (state, action) => ({
        ...state,
        paths: {
            ...state.paths,
            ...action.payload,
        },
    }),

})
