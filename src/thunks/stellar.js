import { loadAccount } from "../lib/stellar-tx"
import { action as StellarAccountAction } from "../redux/StellarAccount"
import { getExchangeRate } from "../thunks/assets"




/**
 * Fetches Stellar account from the network and sufraces loading modal.
 *
 * @function fetchStellarAccount
 * @returns {Function} thunk action
 */
export const fetchStellarAccount = () =>
    async (dispatch, getState) => {

        await dispatch(StellarAccountAction.toggleLoading(true))

        try {
            const stellarAccount = await loadAccount(
                getState().LedgerHQ.publicKey
            )
            await dispatch(StellarAccountAction.updateAccountAttributes(
                stellarAccount
            ))
        } catch (error) {
            // do nothing - accont was not found on the network
        }

        await dispatch(getExchangeRate(getState().Account.currency))

        await dispatch(StellarAccountAction.toggleLoading(false))
    }
