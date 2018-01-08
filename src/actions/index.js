export const sideBarMenuSelect = (path) => {
  return {
    type: 'SIDE_MENU_ITEM_CLICKED',
    payload: path,
  }
}

export const sideBarMenuToggle = (state) => {
  return {
    type: 'SIDE_MENU_STATE_CHANGED',
    payload: state,
  }
}
