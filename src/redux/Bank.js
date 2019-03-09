import { createReducer } from "@xcmats/js-toolbox"




// <Bank> component state
const initState = {
    drawerVisible: true,
    signupHintVisible: true,
}




// ...
export const SET_STATE = "@Bank/SET_STATE"
export const RESET_STATE = "@Bank/RESET_STATE"
export const TOGGLE_DRAWER = "@Bank/DRAWER_TOGGLE"
export const TOGGLE_SIGNUP_HINT = "@Bank/TOGGLE_SIGNUP_HINT"




// ...
export const action = {

    // show/hide bank drawer (see Bank/<BankDrawer> component)
    toggleDrawer: () => ({
        type: TOGGLE_DRAWER,
    }),

    // ...
    toggleSignupHint: (isVisible) => ({
        type: TOGGLE_SIGNUP_HINT,
        isVisible,
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
    [TOGGLE_DRAWER]: (state) => ({
        ...state,
        drawerVisible: !state.drawerVisible,
    }),


    // ...
    [TOGGLE_SIGNUP_HINT]: (state, action) => ({
        ...state,
        signupHintVisible: action.isVisible,
    }),


    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
