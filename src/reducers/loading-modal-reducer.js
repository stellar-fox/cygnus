export default function (state = {}, action) {
    switch (action.type) {
        case "SET_LOADING":
            state = {
                ...state,
                loading: true,
            }
            break

        case "SET_LOADED":
            state = {
                ...state,
                loading: false,
            }
            break

        case "UPDATE_LOADING_MESSAGE":
            state = {
                ...state,
                message: action.payload.message,
            }
            break

        default:
            break
    }
    return state
}
