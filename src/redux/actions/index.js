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
export const hideAlert = (state) => ({
    type: "HIDE_ALERT",
    payload: state,
})


// ...
export const changeLoginState = (loginState) => ({
    type: ActionTypes.CHANGE_LOGIN_STATE,
    payload: loginState,
})


// ...
export const changeModalState = (modalState) => ({
    type: ActionTypes.CHANGE_MODAL_STATE,
    payload: modalState,
})




// Playground...
export const alert = (text, title="Alert") => ({
    type: ActionTypes.CHANGE_MODAL_STATE,
    payload: {
        alertWithDismiss: {
            showing: true,
            title,
            content: text,
        },
    },
})




// ...
export const changeSnackbarState = (snackbarState) => ({
    type: ActionTypes.CHANGE_SNACKBAR_STATE,
    payload: snackbarState,
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
