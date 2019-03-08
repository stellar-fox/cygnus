/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { actions as AppActions } from "../redux/App"




/**
 * Set new screen dimensions when browser-resize event is detected.
 * 
 * @function setScreenDimensions
 * @returns {Function} thunk action
 */
export const setScreenDimensions = () =>
    async (dispatch, _getState) =>
        await dispatch( await AppActions.setDimensions())




// ...
export const setLoading = () =>
    async (dispatch, _getState) => {
        await dispatch(AppActions.toggleLoading(true))
    }




// ...
export const setLoaded = () =>
    async (dispatch, _getState) => {
        await dispatch(AppActions.toggleLoading(false))
    }
