import { createReducer } from "@xcmats/js-toolbox"




// <AlertChoice> component state
const initState = {

    visible: false,
    title: "",
    text: "",

}




// ...
export const ALERT_SHOW = "@AlertChoice/SHOW"
export const ALERT_HIDE = "@AlertChoice/HIDE"




// ...
export const action = {

    // show choice alert (see Modal component)
    showAlert: (text, title = "Confirm") => ({
        type: ALERT_SHOW,
        title,
        text,
    }),


    // hide choice alert (see Modal component)
    hideAlert: () => ({
        type: ALERT_HIDE,
    }),

}




// ...
export const reducer = createReducer(initState)({

    // ...
    [ALERT_SHOW]: (state, action) => ({
        ...state,
        visible: true,
        title: action.title,
        text: action.text,
    }),


    // ...
    [ALERT_HIDE]: (state) => ({
        ...state,
        visible: false,
        title: "",
        text: "",
    }),

})
