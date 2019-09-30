import Axios from "axios"
import { config } from "../config"
import {
    coinRankingBase,
    defaultCurrencyRateUpdateTime,
} from "../components/StellarFox/env"
import { action as AssetAction } from "../redux/Asset"
import { action as ExchangeRatesActions } from "../redux/ExchangeRates"
import { action as SocketActions } from "../redux/Socket"
import toml from "toml"
import { loadAccount } from "../lib/stellar-tx"
import { surfaceSnacky } from "../thunks/main"

/**
 * Fetches the exchange rate via public Kraken API
 *
 * @function getTickerInfo
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @returns {Function} thunk action
 */
export const getTickerInfo = tickerSymbol => async (dispatch, getState) => {
    const rate = getState().ExchangeRates[tickerSymbol].rate,
        lastUpdated = getState().ExchangeRates[tickerSymbol].lastUpdated

    // rate in REDUX is stale or no rate present - fetch it.
    if (!rate || lastUpdated + defaultCurrencyRateUpdateTime < Date.now()) {
        const response = await fetch(
            `${config.krakenTicker}XLM${tickerSymbol.toUpperCase()}`
        )

        if (!response.ok) throw new Error("Kraken API access problem.")
        const data = await response.json()
        const rate = data.result.XXLMZUSD.a[0]

        // update Redux tree
        dispatch(
            ExchangeRatesActions.setRate({
                [tickerSymbol]: {
                    rate,
                    lastUpdated: Date.now(),
                },
            })
        )
    }
}

/**
 * Fetches the exchange rate (throttled)
 *
 * @function getExchangeRate
 * @param {String} tickerSymbol Lower case currency ticker symbol (i.e. usd)
 * @returns {Function} thunk action
 */
export const getExchangeRate = tickerSymbol => async (dispatch, getState) => {
    const rate = getState().ExchangeRates[tickerSymbol].rate,
        lastUpdated = getState().ExchangeRates[tickerSymbol].lastUpdated

    // rate is stale or no rate present - fetch it.
    if (!rate || lastUpdated + defaultCurrencyRateUpdateTime < Date.now()) {
        const rate = await Axios.get(
            `${config.api}/ticker/latest/${tickerSymbol}`
        )
        // update Redux tree
        dispatch(
            ExchangeRatesActions.setRate({
                [tickerSymbol]: {
                    rate: rate.data.data[`price_${tickerSymbol}`],
                    lastUpdated: Date.now(),
                },
            })
        )
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
export const updateExchangeRate = (tickerSymbol, rate) => async (
    dispatch,
    _getState
) => {
    dispatch(
        ExchangeRatesActions.setRate({
            [tickerSymbol]: {
                rate,
                lastUpdated: Date.now(),
            },
        })
    )
}

/**
 * Fetches the live exchange rate from Kraken.
 *
 * @function setSocket
 * @param {String} socketData Socket state data.
 * @returns {Function} thunk action
 */
export const setSocket = socketData => async (dispatch, _getState) =>
    dispatch(SocketActions.setState(socketData))

/**
 * Fetches the historical trade data from Coinrank.
 *
 * @function getCoinHistory
 * @param {String} base base currency symbol
 * @param {String} timePeriod time period for a window of data (i.e. 30d, 1y)
 * @param {String} coinId internal Coinrank id of a coin
 * @returns {Function} thunk action
 */
export const getCoinHistory = (
    base = "eur",
    timePeriod = "30d",
    coinId = "6"
) => async (dispatch, _getState) => {
    const coinData = (await Axios.get(
        `${coinRankingBase}/${coinId}?base=${base.toUpperCase()}&timePeriod=${timePeriod}`
    )).data.data

    dispatch(ExchangeRatesActions.setRate({ coinData }))
}

/**
 * Fetches asset's issuer meta data.
 *
 * @function getAssetInfo
 * @param {String} base issuingAccountId
 * @returns {Function} thunk action
 */
export const getAssetInfo = issuingAccountId => async (dispatch, _getState) => {
    try {
        const issuingAccount = await loadAccount(issuingAccountId)

        if (issuingAccount.home_domain) {
            const currencies = toml.parse(
                (await Axios.get(
                    `https://${issuingAccount.home_domain}/.well-known/stellar.toml`
                )).data
            ).CURRENCIES

            dispatch(
                AssetAction.setState({
                    [issuingAccountId]: { ...currencies },
                })
            )
        }
    } catch (error) {
        await dispatch(
            await surfaceSnacky(
                "warning",
                "Could not load custom asset meta-data."
            )
        )
    }
}
