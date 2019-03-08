import { createReducer } from "@xcmats/js-toolbox"




// <Application> state
const initState = {
    loading: false,
    dim: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
}




// ...
export const SET_DIMENSIONS = "@App/SET_DIMENSIONS"
export const SET_STATE = "@App/SET_STATE"
export const RESET_STATE = "@App/RESET_STATE"
export const TOGGLE_LOADING = "@App/TOGGLE_LOADING"



// ...
export const actions = {

    // ...
    setDimensions: () => ({
        type: SET_DIMENSIONS,
        dim: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
    }),

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE }),


    // ...
    toggleLoading: (loading) => ({
        type: TOGGLE_LOADING,
        loading,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SET_DIMENSIONS]: (state, action) => ({
        ...state,
        dim: { ...action.dim },
    }),


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,


    // ...
    [TOGGLE_LOADING]: (state, action) => ({
        ...state,
        loading: action.loading,
    }),

})
