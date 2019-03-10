/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { actions as AppActions } from "../redux/App"
import { action as SnackyActions } from "../redux/Snacky"




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




// ...
export const surfaceSnacky = (color, message) =>
    async (dispatch, _getState) => {
        await dispatch(SnackyActions.setColor(color))
        await dispatch(SnackyActions.setMessage(message))
        await dispatch(SnackyActions.showSnacky())
    }
