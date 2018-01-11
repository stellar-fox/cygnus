export default function (state=null, action) {
  if (action.type === 'SET_PROGRESS_MESSAGE') {
    return action.payload
  }
  return state
}
