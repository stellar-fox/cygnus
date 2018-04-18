import { createReducer } from "../lib/utils"

const initState = {
    token: null,
    userId: null,
}


// ...
export const SET_API_TOKEN = "LoginManager/SET_API_TOKEN"
export const SET_USER_ID = "LoginManager/SET_USER_ID"
export const RESET_STATE = "LoginManager/RESET_STATE"




// ...
export const action = {

    // ...
    setApiToken: (token) => ({
        type: SET_API_TOKEN,
        token,
    }),


    // ...
    setUserId: (userId) => ({
        type: SET_USER_ID,
        userId,
    }),


    // ...
    resetState: () => ({ type: RESET_STATE, }),
}



// ...
export const reducer = createReducer(initState) ({

    // ...
    [SET_API_TOKEN]: (state, action) => ({
        ...state,
        token: action.token,
    }),


    // ...
    [SET_USER_ID]: (state, action) => ({
        ...state,
        userId: action.userId,
    }),


    // ...
    [RESET_STATE]: () => initState,
})