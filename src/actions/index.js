// The following functions wrap dispatch requests to the store.

export const setPublicKey = (state) => {
    return {
        type: "SET_PUBKEY",
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

export const logOutOfHorizon = (state) => {
  return {
    type: 'LOG_OUT_OF_HORIZON',
    payload: state,
  }
}

export const logInToHorizon = (state) => {
  return {
    type: 'LOG_IN_TO_HORIZON',
    payload: state,
  }
}

export const logIn = (state) => {
  return {
    type: 'LOG_IN',
    payload: state,
  }
}

export const logOut = (state) => {
  return {
    type: 'LOG_OUT',
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

export const setTab = (state) => {
  return {
    type: 'SET_TAB_SELECTED',
    payload: state,
  }
}

export const setCurrency = (state) => {
  return {
    type: 'SET_CURRENCY',
    payload: state,
  }
}

export const setAccountPayments = (state) => {
  return {
    type: 'SET_ACCOUNT_PAYMENTS',
    payload: state,
  }
}

export const setAccountTransactions = (state) => {
  return {
    type: 'SET_ACCOUNT_TRANSACTIONS',
    payload: state,
  }
}

export const setHorizonEndPoint = (state) => {
  return {
    type: 'SET_HORIZON_END_POINT',
    payload: state,
  }
}

export const setCurrencyPrecision = (state) => {
  return {
    type: 'SET_CURRENCY_PRECISION',
    payload: state,
  }
}

export const setStreamer = (state) => {
  return {
    type: 'SET_STREAMER',
    payload: state,
  }
}

export const setInvalidInputMessage = (state) => {
  return {
    type: 'SET_INVALID_INPUT_MESSAGE',
    payload: state,
  }
}

export const setAccountRegistered = (state) => {
  return {
    type: 'SET_ACCOUNT_REGISTERED',
    payload: state,
  }
}

export const setAccountPath = (state) => {
    return {
        type: "SET_ACCOUNT_PATH",
        payload: state,
    }
}

export const setLedgerSoftwareVersion = (state) => {
    return {
        type: "SET_LEDGER_SOFTWARE_VERSION",
        payload: state,
    }
}