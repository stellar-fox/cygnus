export default function (state=null, action) {
  if (action.type === 'ACCOUNT_NUMBER_UPDATED') {
    return action.payload
  }
  return state
}
