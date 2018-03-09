const initState = {}


export default (state = initState, action) => (
    (type) =>
        type === "SET_TOKEN" ?
            { ...state, token: action.payload, } :
            type === "SET_USER_ID" ?
                { ...state, userId: action.payload, } :
                type === "SET_PUB_KEY" ?
                    { ...state, pubKey: action.payload, } :
                    type === "SET_PATH_INDEX" ?
                        { ...state, pathIndex: action.payload, } :
                        state
)(action.type)
