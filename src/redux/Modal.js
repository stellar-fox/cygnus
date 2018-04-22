import { createReducer } from "../lib/utils"




// <Bank> component state
const initState = {

    visible: false,
    modalId: null,

}




// ...
export const MODAL_SHOW = "@Modal/SHOW"
export const MODAL_HIDE = "@Modal/HIDE"




// ...
export const action = {

    // show modal (see Modal component)
    showModal: (modalId) => ({
        type: MODAL_SHOW,
        modalId,
    }),

    // hide modal (see Modal component)
    hideModal: (modalId) => ({
        type: MODAL_HIDE,
        modalId,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [MODAL_SHOW]: (state, action) => ({
        ...state,
        visible: true,
        modalId: action.modalId,
    }),


    // ...
    [MODAL_HIDE]: (state) => ({
        ...state,
        visible: false,
        modalId: null,
    }),

})
