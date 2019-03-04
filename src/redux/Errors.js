import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"




// <Errors> component state
const initState = {
    emailInputError: false,
    emailInputErrorMessage: string.empty(),
    passwordInputError: false,
    passwordInputErrorMessage: string.empty(),
}




// ...

export const CLEAR_EMAIL_INPUT_ERROR = "@Errors/CLEAR_EMAIL_INPUT_ERROR"
export const CLEAR_PASSWORD_INPUT_ERROR = "@Errors/CLEAR_PASSWORD_INPUT_ERROR"
export const SET_EMAIL_INPUT_ERROR = "@Errors/SET_EMAIL_INPUT_ERROR"
export const SET_PASSWORD_INPUT_ERROR = "@Errors/SET_PASSWORD_INPUT_ERROR"
export const SET_STATE = "@Errors/SET_STATE"
export const RESET_STATE = "@Errors/RESET_STATE"




// ...
export const actions = {

    // ...
    clearEmailInputError: (state) => ({
        type: CLEAR_EMAIL_INPUT_ERROR,
        state,
    }),

    // ...
    clearPasswordInputError: (state) => ({
        type: CLEAR_PASSWORD_INPUT_ERROR,
        state,
    }),

    // ...
    setEmailInputError: (errorMessage) => ({
        type: SET_EMAIL_INPUT_ERROR,
        errorMessage,
    }),

    // ...
    setPasswordInputError: (errorMessage) => ({
        type: SET_PASSWORD_INPUT_ERROR,
        errorMessage,
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
    [CLEAR_EMAIL_INPUT_ERROR]: (state) => ({
        ...state,
        emailInputError: false,
        emailInputErrorMessage: string.empty(),
    }),

    // ...
    [CLEAR_PASSWORD_INPUT_ERROR]: (state) => ({
        ...state,
        passwordInputError: false,
        passwordInputErrorMessage: string.empty(),
    }),

    // ...
    [SET_EMAIL_INPUT_ERROR]: (state, action) => ({
        ...state,
        emailInputError: true,
        emailInputErrorMessage: action.errorMessage,
    }),

    // ...
    [SET_PASSWORD_INPUT_ERROR]: (state, action) => ({
        ...state,
        passwordInputError: true,
        passwordInputErrorMessage: action.errorMessage,
    }),

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

    // ...
    [RESET_STATE]: () => initState,

})
