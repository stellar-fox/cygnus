import { createReducer } from "../lib/utils"




// <Bank> component state
const initState = {

    drawerVisible: true,

}




// ...
export const TOGGLE_DRAWER = "@Bank/DRAWER_TOGGLE"




// ...
export const action = {

    // show/hide bank drawer (see Bank/<BankDrawer> component)
    toggleDrawer: () => ({
        type: TOGGLE_DRAWER,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [TOGGLE_DRAWER]: (state) => ({
        ...state,
        drawerVisible: !state.drawerVisible,
    }),

})
