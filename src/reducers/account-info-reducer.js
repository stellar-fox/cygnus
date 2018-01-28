export default function (state={}, action) {
  switch (action.type) {
    case 'CLEAR_ACCOUNT_INFO':
      state = {}
      break;
    case 'PUBKEY_VALID':
      state = {
        ...state,
        pubKey: action.payload.pubKey,
        message: action.payload.message,
        valid: true,
      }
      break;
    case 'PUBKEY_INVALID':
      state = {
        ...state,
        pubKey: action.payload.pubKey,
        message: action.payload.message,
        valid: false,
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
    case 'SET_CURRENCY_PRECISION':
      state = {...state, precision: action.payload}
      break;
    default:
      return state
  }
  return state
}
