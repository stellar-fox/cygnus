import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { nativeToAsset } from "../../logic/assets"
import NumberFormat from "react-number-format"
import krakenSocket from "../KrakenSocket"
import {
    setSocket,
    updateExchangeRate,
} from "../../thunks/assets"


let socket


/**
 * `<CurrencyBalance>` component.
 *
 * @function CurrencyBalance
 * @returns {React.ReactElement}
 */
const CurrencyBalance = ({
    balance, currency, preferredRate, setSocket, updateExchangeRate,
}) => {


    React.useEffect(() => {
        const fnModule = {
            updateExchangeRate,
            setSocket,
        }
        socket = krakenSocket(currency, fnModule)
    }, [])

    React.useEffect(() => {
        return () => socket.close()
    }, [])

    return <NumberFormat
        value={nativeToAsset(
            balance,
            preferredRate
        )}
        displayType={"text"}
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale={true}
    />

}




// ...
export default connect(
    (state) => ({
        balance: state.StellarAccount.balance,
        currency: state.Account.currency,
        preferredRate: state.ExchangeRates[state.Account.currency].rate,
    }),
    (dispatch) => bindActionCreators({
        setSocket,
        updateExchangeRate,
    }, dispatch),
)(CurrencyBalance)
