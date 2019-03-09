import {
    createReducer,
    string,
} from "@xcmats/js-toolbox"




// <Snacky> component state
const initState = {
    open: false,
    message: string.empty(),
    color: "default",
}




// ...
export const SNACKY_SHOW = "@Snacky/SHOW"
export const SNACKY_HIDE = "@Snacky/HIDE"
export const SET_MESSAGE = "@Snacky/SET_MESSAGE"
export const SET_COLOR = "@Snacky/SET_COLOR"




// ...
export const action = {

    // show snacky (see Snacky component)
    showSnacky: () => ({
        type: SNACKY_SHOW,
    }),

    setColor: (color) => ({
        type: SET_COLOR,
        color,
    }),

    setMessage: (message) => ({
        type: SET_MESSAGE,
        message,
    }),

    // hide snacky
    hideSnacky: () => ({
        type: SNACKY_HIDE,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [SNACKY_SHOW]: (state) => ({
        ...state,
        open: true,
    }),


    // ...
    [SET_MESSAGE]: (state, action) => ({
        ...state,
        message: action.message,
    }),


    // ...
    [SET_COLOR]: (state, action) => ({
        ...state,
        color: action.color,
    }),


    // ...
    [SNACKY_HIDE]: (state) => ({
        ...state,
        open: false,
    }),

})
