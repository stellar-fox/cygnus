export default function (state={default: 'eur'}, action) {
  switch (action.type) {
    case 'SET_CURRENCY':
      state = {...state, default: action.payload}
      break;
    default:
      break;
  }
  return state
}
