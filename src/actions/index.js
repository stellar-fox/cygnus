// The following functions wrap dispatch requests to the store.

export const setPublicKeyValid = (state) => {
  return {
    type: 'PUBKEY_VALID',
    payload: state,
  }
}

export const setPublicKeyInvalid = (state) => {
  return {
    type: 'PUBKEY_INVALID',
    payload: state,
  }
}

export const accountExistsOnLedger = (state) => {
  return {
    type: 'ACCOUNT_EXISTS_ON_LEDGER',
    payload: state,
  }
}

export const accountMissingOnLedger = (state) => {
  return {
    type: 'ACCOUNT_MISSING_ON_LEDGER',
    payload: state,
  }
}

export const clearAccountInfo = (state) => {
  return {
    type: 'CLEAR_ACCOUNT_INFO',
    payload: state,
  }
}

export const setModalLoading = (state) => {
  return {
    type: 'SET_LOADING',
    payload: state,
  }
}

export const setModalLoaded = (state) => {
  return {
    type: 'SET_LOADED',
    payload: state,
  }
}

export const updateLoadingMessage = (state) => {
  return {
    type: 'UPDATE_LOADING_MESSAGE',
    payload: state,
  }
}

export const logOut = (state) => {
  return {
    type: 'LOG_OUT',
    payload: state,
  }
}

export const logIn = (state) => {
  return {
    type: 'LOG_IN',
    payload: state,
  }
}

export const selectView = (state) => {
  return {
    type: 'SELECT_VIEW',
    payload: state,
  }
}

export const openDrawer = (state) => {
  return {
    type: 'OPEN_DRAWER',
    payload: state,
  }
}

export const closeDrawer = (state) => {
  return {
    type: 'CLOSE_DRAWER',
    payload: state,
  }
}

export const enableAuthenticateButton = (state) => {
  return {
    type: 'ENABLE_AUTHENTICATE_BUTTON',
    payload: state,
  }
}

export const disableAuthenticateButton = (state) => {
  return {
    type: 'DISABLE_AUTHENTICATE_BUTTON',
    payload: state,
  }
}

export const setExchangeRate = (state) => {
  return {
    type: 'SET_EXCHANGE_RATE',
    payload: state,
  }
}

export const showAlert = (state) => {
  return {
    type: 'SHOW_ALERT',
    payload: state,
  }
}

export const hideAlert = (state) => {
  return {
    type: 'HIDE_ALERT',
    payload: state,
  }
}

export const setAccountTab = (state) => {
  return {
    type: 'SET_TAB',
    payload: state,
  }
}

export const setCurrency = (state) => {
  return {
    type: 'SET_CURRENCY',
    payload: state,
  }
}

export const setAccountOperations = (state) => {
  return {
    type: 'SET_ACCOUNT_OPERATIONS',
    payload: state,
  }
}
