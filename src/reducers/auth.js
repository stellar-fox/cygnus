const initState = {}


export default (state = initState, action) => (
    (_state, type) => (type === "SET_TOKEN" ? {token: action.payload,} : {})
)(state, action.type)
