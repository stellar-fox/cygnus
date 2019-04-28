import Axios from "axios"
import { config } from "../config"
import { defaultCurrencyRateUpdateTime } from "../components/StellarFox/env"
import { action as ExchangeRatesActions } from "../redux/ExchangeRates"
import { action as SocketActions } from "../redux/Socket"



/**
 * Fetches the exchange rate (throttled)
 *
 * @function getExchangeRate
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @returns {Function} thunk action
 */
export const getExchangeRate = (tickerSymbol) =>
    async (dispatch, getState) => {

        const rate = getState().ExchangeRates[tickerSymbol].rate,
            lastUpdated = getState().ExchangeRates[tickerSymbol].lastUpdated

        // rate is stale or no rate present - fetch it.
        if (!rate || lastUpdated + defaultCurrencyRateUpdateTime < Date.now()) {
            const rate = await Axios.get(
                `${config.api}/ticker/latest/${tickerSymbol}`
            )
            // update Redux tree
            dispatch(ExchangeRatesActions.setRate({
                [tickerSymbol]: {
                    rate: rate.data.data[`price_${tickerSymbol}`],
                    lastUpdated: Date.now(),
                },
            }))
        }

    }




/**
 * Fetches the exchange rate (throttled)
 *
 * @function updateExchangeRate
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @param {String} rate Current exchange rate coming from service provider.
 * @returns {Function} thunk action
 */
export const updateExchangeRate = (tickerSymbol, rate) =>
    async (dispatch, _getState) => {
        dispatch(ExchangeRatesActions.setRate({
            [tickerSymbol]: {
                rate,
                lastUpdated: Date.now(),
            },
        }))
    }




/**
 * Fetches the exchange rate (throttled)
 *
 * @function setSocket
 * @param {String} socketData Socket state data.
 * @returns {Function} thunk action
 */
export const setSocket = (socketData) =>
    async (dispatch, _getState) =>
        dispatch(SocketActions.setState(socketData))
