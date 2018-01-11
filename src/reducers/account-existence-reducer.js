export default function (state=null, action) {
  if (action.type === 'SET_ACCOUNT_EXISTS') {
    return action.payload
  }
  return state
}
