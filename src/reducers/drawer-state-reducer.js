export default function (state=true, action) {
  if (action.type === 'SIDE_MENU_STATE_CHANGED') {
    return action.payload
  }
  return state
}
