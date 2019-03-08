import { createReducer } from "@xcmats/js-toolbox"




// <Bank> component state
const initState = {
    drawerVisible: true,
}




// ...
export const SET_STATE = "@Bank/SET_STATE"
export const RESET_STATE = "@Bank/RESET_STATE"
export const TOGGLE_DRAWER = "@Bank/DRAWER_TOGGLE"




// ...
export const action = {

    // show/hide bank drawer (see Bank/<BankDrawer> component)
    toggleDrawer: () => ({
        type: TOGGLE_DRAWER,
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
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),


    // ...
    [RESET_STATE]: () => initState,

})
