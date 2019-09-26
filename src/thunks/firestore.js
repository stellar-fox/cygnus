import firebaseApp from "../firebase"
import { defaultCurrencyRateUpdateTime } from "../components/StellarFox/env"
import { action as ExchangeRatesActions } from "../redux/ExchangeRates"

const firestore = firebaseApp.firestore()

export const getThrottledExchangeRate = tickerSymbol => async (
    dispatch,
    getState
) => {
    const rate = getState().ExchangeRates[tickerSymbol].rate,
        lastUpdated = getState().ExchangeRates[tickerSymbol].lastUpdated

    // rate is stale or no rate present - fetch it.
    if (!rate || lastUpdated + defaultCurrencyRateUpdateTime < Date.now()) {
        const snapshot = await firestore.collection("exchangeRates").get()
        snapshot.forEach(doc => {
            dispatch(
                ExchangeRatesActions.setRate({
                    [tickerSymbol]: {
                        rate: doc.data().ticker[tickerSymbol].rate,
                        lastUpdated: Date.now(),
                    },
                })
            )
        })
    }
}
