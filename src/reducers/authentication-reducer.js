export default function (state=false, action) {
  switch (action.type) {
    case 'LOG_IN':
      state = {...state, isAuthenticated: true}
      break;
    case 'LOG_OUT':
      state = {...state, isAuthenticated: false}
      break;
    default:
      break;
  }
  return state
}
