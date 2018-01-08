export default function (state=null, action) {
  if (action.type === 'SIDE_MENU_ITEM_CLICKED') {
    return action.payload
  }
  return state
}
