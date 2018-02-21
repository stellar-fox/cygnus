export default function (state = null, action) {
    switch (action.type) {
        case "SELECT_VIEW":
            state = { ...state, viewName: action.payload, }
            break

        default:
            break
    }
    return state
}
