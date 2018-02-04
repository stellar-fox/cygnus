const initState = {
  isAuthenticated: false,
  isReadOnly: true,
  isHorizonLoggedIn: false,
}
export default function (state=initState, action) {
  switch (action.type) {
    case 'LOG_IN_TO_HORIZON':
      state = {...state, isHorizonLoggedIn: true, isReadOnly: action.payload.isReadOnly}
      break;
    case 'LOG_OUT_OF_HORIZON':
      state = {...state, isHorizonLoggedIn: false, isReadOnly: true}
      break;
    default:
      break;
  }
  return state
}
