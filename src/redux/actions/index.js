import { ActionTypes } from "../reducers/mono-reducer"




// ...
export const setModalLoading = (state) => ({
    type: "SET_LOADING",
    payload: state,
})


// ...
export const setModalLoaded = (state) => ({
    type: "SET_LOADED",
    payload: state,
})


// ...
export const updateLoadingMessage = (state) => ({
    type: "UPDATE_LOADING_MESSAGE",
    payload: state,
})


// ...
export const togglePaymentCard = (cardState) => ({
    type: ActionTypes.TOGGLE_PAYMENT_CARD,
    payload: cardState, // Object
})


// ...
export const resetUiState = () => ({
    type: ActionTypes.RESET_UI_STATE,
})
