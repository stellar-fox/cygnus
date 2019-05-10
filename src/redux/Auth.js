import { createReducer } from "@xcmats/js-toolbox"




// ...
const initState = {
    authenticated: false,
    signupInProgress: false,
    signupComplete: false,
}




// ...
export const SET_SIGNUP_COMPLETE = "@Auth/SET_SIGNUP_COMPLETE"
export const SET_STATE = "@Auth/SET_STATE"
export const RESET_STATE = "@Auth/RESET_STATE"
export const TOGGLE_SIGNUP_PROGRESS = "@Auth/TOGGLE_SIGNUP_PROGRESS"




// ...
export const action = {

    // ...
    setState: (state) => ({
        type: SET_STATE,
        state,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE }),


    // ...
    setSignupComplete: (state) => ({
        type: SET_SIGNUP_COMPLETE,
        state,
    }),


    // ...
    toggleSignupProgress: (inProgress) => ({
        type: TOGGLE_SIGNUP_PROGRESS,
        inProgress,
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


    // ...
    [SET_SIGNUP_COMPLETE]: (state) => ({
        ...state,
        signupComplete: true,
    }),


    // ...
    [TOGGLE_SIGNUP_PROGRESS]: (state, action) => ({
        ...state,
        signupInProgress: action.inProgress,
    }),

})
