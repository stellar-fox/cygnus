// ...
const initState = {
    authenticateButton: {
        isDisabled: true,
    },
    tabs: {},
    messages: {},
}




// ...
export default function (state = initState, action) {
    switch (action.type) {

        case "DISABLE_AUTHENTICATE_BUTTON":
            state = {
                ...state,
                authenticateButton: { isDisabled: true, },
            }
            break

        case "ENABLE_AUTHENTICATE_BUTTON":
            state = {
                ...state,
                authenticateButton: { isDisabled: false, },
            }
            break

        // TODO: move this functionality to <Account> reducer
        case "SET_TAB_SELECTED":
            state = {
                ...state,
                tabs: Object.assign(state.tabs || {}, action.payload),
            }
            break

        case "SET_INVALID_INPUT_MESSAGE":
            state = {
                ...state,
                messages: Object.assign(
                    state.messages || {},
                    action.payload
                ),
            }
            break

        case "LOG_OUT":
            state = {
                ...state,
                tabs: {},
                messages: {},
                drawer: { isOpened: true, },
            }
            break

        default:
            break

    }

    return state
}
