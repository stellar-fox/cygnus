import { ActionTypes } from "../reducers/mono-reducer"




// ...
export const setPublicKey = (state) => ({
    type: "SET_PUBKEY",
    payload: state,
})


// ...
export const accountExistsOnLedger = (state) => ({
    type: "ACCOUNT_EXISTS_ON_LEDGER",
    payload: state,
})


// ...
export const accountMissingOnLedger = (state) => ({
    type: "ACCOUNT_MISSING_ON_LEDGER",
    payload: state,
})


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
export const logIn = (state) => ({
    type: "LOG_IN",
    payload: state,
})


// ...
export const logOut = (state) => ({
    type: "LOG_OUT",
    payload: state,
})


// ...
export const enableAuthenticateButton = (state) => ({
    type: "ENABLE_AUTHENTICATE_BUTTON",
    payload: state,
})


// ...
export const disableAuthenticateButton = (state) => ({
    type: "DISABLE_AUTHENTICATE_BUTTON",
    payload: state,
})


// ...
export const setExchangeRate = (state) => ({
    type: "SET_EXCHANGE_RATE",
    payload: state,
})


// ...
export const showAlert = (state) => ({
    type: "SHOW_ALERT",
    payload: state,
})


// ...
export const hideAlert = (state) => ({
    type: "HIDE_ALERT",
    payload: state,
})


// ...
export const setCurrency = (state) => ({
    type: "SET_CURRENCY",
    payload: state,
})


// ...
export const setAccountPayments = (state) => ({
    type: "SET_ACCOUNT_PAYMENTS",
    payload: state,
})


// ...
export const setAccountTransactions = (state) => ({
    type: "SET_ACCOUNT_TRANSACTIONS",
    payload: state,
})


// ...
export const setCurrencyPrecision = (state) => ({
    type: "SET_CURRENCY_PRECISION",
    payload: state,
})


// FIXME (merge streamers)
// ...
export const setStreamer = (streamer) => ({
    type: "SET_STREAMER",
    payload: streamer,
})


// FIXME (merge streamers)
// ...
export const setOptionsStreamer = (optionsStreamer) => ({
    type: "SET_OPTIONS_STREAMER",
    payload: optionsStreamer,
})


// ...
export const setInvalidInputMessage = (state) => ({
    type: "SET_INVALID_INPUT_MESSAGE",
    payload: state,
})


// ...
export const setAccountRegistered = (state) => ({
    type: "SET_ACCOUNT_REGISTERED",
    payload: state,
})


// ...
export const setAccountPath = (state) => ({
    type: "SET_ACCOUNT_PATH",
    payload: state,
})


// ...
export const setLedgerSoftwareVersion = (state) => ({
    type: "SET_LEDGER_SOFTWARE_VERSION",
    payload: state,
})


// ...
export const ActionConstants = {
    LOGGING_IN: "LOGGING_IN",
    LOGGING_OUT: "LOGGING_OUT",
    LOGGED_IN: "LOGGED_IN",
    LOGGED_OUT: "LOGGED_OUT",
}


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
export const setHorizonEndPoint = (uri) => ({
    type: "SET_HORIZON_END_POINT",
    payload: uri,
})

// ...
export const resetUiState = () => ({
    type: ActionTypes.RESET_UI_STATE,
})
