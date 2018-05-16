import { createReducer } from "@xcmats/js-toolbox"




// <Snackbar> component state
const initState = {

    visible: false,
    message: "",

}




// ...
export const SNACKBAR_POPUP = "@Snackbar/POPUP"
export const SNACKBAR_RESET = "@Snackbar/RESET"




// ...
export const action = {

    // popup snackbar (see Snackbar component)
    popupSnackbar: (message) => ({
        type: SNACKBAR_POPUP,
        message,
    }),


    // reset snackbar state on auto dismiss
    reset: () => ({
        type: SNACKBAR_RESET,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SNACKBAR_POPUP]: (state, action) => ({
        ...state,
        visible: true,
        message: action.message,
    }),


    // ...
    [SNACKBAR_RESET]: (state) => ({
        ...state,
        visible: false,
        message: "",
    }),

})
