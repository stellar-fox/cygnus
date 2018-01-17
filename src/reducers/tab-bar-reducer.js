const initState = {
  tabSelected: '1'
}

export default function (state=initState, action) {
  switch (action.type) {
    case 'SET_TAB':
      state = {...state, tabSelected: action.payload}
      break;
    default:
      break;
  }
  return state
}
