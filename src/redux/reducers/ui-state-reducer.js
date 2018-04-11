// ...
const initState = {
    authenticateButton: { isDisabled: true, },
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
            }
            break

        default:
            break

    }

    return state
}
