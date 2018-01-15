export default function (state=false, action) {
  switch (action.type) {
    case 'LOG_IN':
      state = {...state, isAuthenticated: true, isReadOnly: action.payload.isReadOnly}
      break;
    case 'LOG_OUT':
      state = {...state, isAuthenticated: false, isReadOnly: true}
      break;
    default:
      break;
  }
  return state
}
