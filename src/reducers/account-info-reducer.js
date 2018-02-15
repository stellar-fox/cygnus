const initState = {
  currency: 'eur',
  precision: 2
}

export default function (state=initState, action) {
  switch (action.type) {
    case 'LOG_OUT_OF_HORIZON':
      state = initState
      break;
    case 'LOG_OUT':
      state = initState
      break;
    case 'SET_ACCOUNT_PATH':
      state = {...state, accountPath: action.payload}
      break;
    case 'SET_PUBKEY':
      state = {
        ...state,
        pubKey: action.payload
      }
      break;
    case 'ACCOUNT_EXISTS_ON_LEDGER':
      state = {...state, account: action.payload, exists: true}
      break;
    case 'ACCOUNT_MISSING_ON_LEDGER':
      state = {...state, account: null, exists: false}
      break;
    case 'SET_EXCHANGE_RATE':
      state = {...state, rates: Object.assign(state.rates || {}, action.payload)}
      break;
    case 'SET_ACCOUNT_PAYMENTS':
      state = {...state, payments: action.payload}
      break;
    case 'SET_ACCOUNT_TRANSACTIONS':
      state = {...state, transactions: action.payload}
      break;
    case 'SET_HORIZON_END_POINT':
      state = {...state, horizon: action.payload}
      break;
    case 'SET_CURRENCY':
      state = {...state, currency: action.payload}
      break;
    case 'SET_CURRENCY_PRECISION':
      state = {...state, precision: action.payload}
      break;
    case 'SET_STREAMER':
      state = {...state, streamer: action.payload}
      break;
    case 'SET_ACCOUNT_REGISTERED':
      state = {...state, registered: action.payload}
      break;
    default:
      return state
  }
  return state
}
