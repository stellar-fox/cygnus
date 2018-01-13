export default function (state={drawer: {isOpened: true}}, action) {
  switch (action.type) {
    case 'OPEN_DRAWER':
      state = {...state, drawer: {isOpened: true}}
      break;
    case 'CLOSE_DRAWER':
      state = {...state, drawer: {isOpened: false}}
      break;
    default:
      break;
  }
  return state
}
