import { createReducer } from "@xcmats/js-toolbox"




// <Modal> component state
const initState = {
    visible: false,
    modalId: null,
}




// ...
export const MODAL_SHOW = "@Modal/SHOW"
export const MODAL_HIDE = "@Modal/HIDE"
export const RESET_STATE = "@Modal/RESET_STATE"




// ...
export const action = {

    // show modal (see Modal component)
    showModal: (modalId) => ({
        type: MODAL_SHOW,
        modalId,
    }),


    // hide modal (see Modal component)
    hideModal: () => ({
        type: MODAL_HIDE,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE }),

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


    // ...
    [RESET_STATE]: () => initState,

})
