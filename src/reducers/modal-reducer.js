export default function (state={isShowing: false}, action) {
  switch (action.type) {
    case 'SHOW_ALERT':
      state = {...state, isShowing: true}
      break;
      case 'HIDE_ALERT':
        state = {...state, isShowing: false}
      break;
    default:
      break;
  }
  return state
}
