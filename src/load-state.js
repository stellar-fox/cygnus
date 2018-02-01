/*
 * This persists current state of the application. When the page is reloaded
 * the current Redux state is restored from the sessionStorage. Redux state
 * is saved in index.js.
*/

export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('SFOX.APP_STATE')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (e) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    sessionStorage.setItem('SFOX.APP_STATE', serializedState)
  } catch (e) {
    console.log('Could not save application state.')
  }
}
