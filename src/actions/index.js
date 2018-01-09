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

export const logOutButtonPress = (state) => {
  return {
    type: 'LOG_OUT',
    payload: state,
  }
}

export const logInViaPublicKey = (state) => {
  return {
    type: 'LOG_IN',
    payload: state,
  }
}

export const updateAccountNumber = (state) => {
  return {
    type: 'ACCOUNT_NUMBER_UPDATED',
    payload: state,
  }
}
