const ActionTypes = {
    CHANGE_LOGIN_STATE: "CHANGE_LOGIN_STATE",
    SET_HW_PARAMS: "SET_HW_PARAMS",
    SELECT_VIEW: "SELECT_VIEW",
}


function createReducer (initState = {}, handlers) {
    return function reducer (state = initState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}


export const authReducer = createReducer({}, {
    [ActionTypes.CHANGE_LOGIN_STATE] (state, action) {
        state = {...state, loginState: action.payload,}
        return state
    },
    [ActionTypes.SET_HW_PARAMS] (state, action) {
        state = { ...state, hw: action.payload, }
        return state
    },
})


export const navReducer = createReducer({}, {
    [ActionTypes.SELECT_VIEW] (state, action) {
        state = { ...state, view: action.payload, }
        return state
    },
})
