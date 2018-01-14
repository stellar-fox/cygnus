const initState = {
  drawer: {
    isOpened: true,
  },
  authenticateButton: {
    isDisabled: true,
  }
}
export default function (state=initState, action) {
  switch (action.type) {
    case 'OPEN_DRAWER':
      state = {...state, drawer: {isOpened: true}}
      break;
    case 'CLOSE_DRAWER':
      state = {...state, drawer: {isOpened: false}}
      break;
    case 'DISABLE_AUTHENTICATE_BUTTON':
      state = {...state, authenticateButton: {isDisabled: true}}
      break;
    case 'ENABLE_AUTHENTICATE_BUTTON':
      state = {...state, authenticateButton: {isDisabled: false}}
      break;
    default:
      break;
  }
  return state
}
