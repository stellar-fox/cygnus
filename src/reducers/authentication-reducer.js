const initState = {
    isAuthenticated: false,
    isReadOnly: true,
}

export default function (state = initState, action) {
    switch (action.type) {
        case "LOG_IN":
            state = {
                ...state,
                isAuthenticated: true,
                userId: action.payload.userId,
                token: action.payload.token,
                pubkey: action.payload.pubkey,
            }
            break

        case "LOG_OUT":
            state = initState
            break


        case "SET_LEDGER_SOFTWARE_VERSION":
            state = {
                ...state,
                ledgerSoftwareVersion: action.payload,
            }
            break

        default:
            break
    }
    return state
}
