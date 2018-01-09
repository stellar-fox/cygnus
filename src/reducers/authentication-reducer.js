export default function (state=false, action) {
  if (action.type === 'LOG_OUT') {
    return action.payload
  }
  if (action.type === 'LOG_IN') {
    return action.payload
  }
  return state
}
