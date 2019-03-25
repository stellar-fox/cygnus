/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { actions as AppActions } from "../redux/App"
import { action as BankActions } from "../redux/Bank"
import { action as SnackyActions } from "../redux/Snacky"
import { delay } from "@xcmats/js-toolbox"




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




// ...
export const blinkPayentStreamerLed = () =>
    async (dispatch, _getState) => {
        await dispatch(BankActions.togglePaymentStreamerLed(true))
        delay(150).then(() => {
            dispatch(BankActions.togglePaymentStreamerLed(false))
        })
    }




// ...
export const blinkOperationStreamerLed = () =>
    async (dispatch, _getState) => {
        await dispatch(BankActions.toggleOperationStreamerLed(true))
        delay(150).then(() => {
            dispatch(BankActions.toggleOperationStreamerLed(false))
        })
    }




// ...
export const streamerPaymentConnected = (connected) =>
    async (dispatch, _getState) =>
        await dispatch(BankActions.togglePaymentStreamerConnected(connected))




// ...
export const streamerOperationConnected = (connected) =>
    async (dispatch, _getState) =>
        await dispatch(BankActions.toggleOperationStreamerConnected(connected))
