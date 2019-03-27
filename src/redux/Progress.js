import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"




// <Progress> component state
const initState = {
    signin: {
        inProgress: false,
        statusMessage: string.empty(),
    },
    signup: {
        inProgress: false,
        statusMessage: string.empty(),
    },
    ledgerauth: {
        inProgress: false,
        statusMessage: string.empty(),
    },
    implosion: {
        inProgress: false,
        statusMessage: string.empty(),
    },
}




// ...
export const TOGGLE_PROGRESS = "@Progress/TOGGLE_PROGRESS"
export const SET_STATE = "@Progress/SET_STATE"
export const RESET_STATE = "@Progress/RESET_STATE"




// ...
export const actions = {

    // ...
    toggleProgress: (key, statusMessage) => ({
        type: TOGGLE_PROGRESS,
        key,
        statusMessage,
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
    [TOGGLE_PROGRESS]: (state, action) => ({
        ...state,
        [action.key]: {
            inProgress: action.statusMessage ? true : false,
            statusMessage: action.statusMessage,
        },
    }),

    // ...
    [SET_STATE]: (state, action) => ({
        ...state,
        ...action.state,
    }),

    // ...
    [RESET_STATE]: () => initState,

})
