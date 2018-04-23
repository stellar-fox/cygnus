import { createReducer } from "../lib/utils"




// <LoadingModal> component state
const initState = {

    visible: false,
    text: "",

}




// ...
export const LOADING_MODAL_SHOW = "@LoadingModal/SHOW"
export const LOADING_MODAL_HIDE = "@LoadingModal/HIDE"




// ...
export const action = {

    // show loading modal (see LoadingModal component)
    showLoadingModal: (text) => ({
        type: LOADING_MODAL_SHOW,
        text,
    }),

    // hide loading modal (see LoadingModal component)
    hideLoadingModal: () => ({
        type: LOADING_MODAL_HIDE,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [LOADING_MODAL_SHOW]: (state, action) => ({
        ...state,
        visible: true,
        text: action.text,
    }),


    // ...
    [LOADING_MODAL_HIDE]: (state) => ({
        ...state,
        visible: false,
        text: "",
    }),

})
