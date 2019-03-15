/**
 * Fusion.
 *
 * Thunks.
 *
 * @module thunks
 * @license Apache-2.0
 */




import { getSoftwareVersion } from "../lib/ledger"
import { action as LedgerActions } from "../redux/LedgerHQ"




/**
 * Query LedgerHQ device for software version.
 *
 * @function queryDevice
 * @returns {Function} thunk action
 */
export const queryDevice = () =>
    async (dispatch, _getState) => {
        const softwareVersion = await getSoftwareVersion()
        await dispatch(LedgerActions.setState({
            connected: true,
            softwareVersion,
        }))
    }

