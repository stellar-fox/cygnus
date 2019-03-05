import { createReducer } from "@xcmats/js-toolbox"




// <Progress> component state
const initState = {
    signup: {
        inProgress: false,
    },
}




// ...
export const TOGGLE_SIGNUP_PROGRESS = "@Progress/TOGGLE_SIGNUP_PROGRESS"
export const SET_STATE = "@Progress/SET_STATE"
export const RESET_STATE = "@Progress/RESET_STATE"




// ...
export const actions = {

    // ...
    toggleProgress: (key, inProgress) => ({
        type: TOGGLE_SIGNUP_PROGRESS,
        key,
        inProgress,
    }),

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
    [TOGGLE_SIGNUP_PROGRESS]: (state, action) => ({
        ...state,
        [action.key]: {inProgress: action.inProgress},
    }),

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

    // ...
    [RESET_STATE]: () => initState,

})
