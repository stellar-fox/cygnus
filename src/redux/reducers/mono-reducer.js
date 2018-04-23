import { createReducer } from "../../lib/utils"




// ...
export const ActionTypes = {
    TOGGLE_PAYMENT_CARD: "TOGGLE_PAYMENT_CARD",
    RESET_UI_STATE: "MonoReducer/RESET_UI_STATE",
}




// ...
const uiInitState = {
    modals: {},
    cards: {},
}




// ...
export const uiReducer = createReducer(uiInitState)({

    // ...
    [ActionTypes.TOGGLE_PAYMENT_CARD]: (state, action) => ({
        ...state,
        cards: action.payload,
    }),

    // ...
    [ActionTypes.RESET_UI_STATE]: () => uiInitState,

})
