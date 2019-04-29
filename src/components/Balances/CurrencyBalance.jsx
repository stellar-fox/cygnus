import React from "react"
import { connect } from "react-redux"
import { nativeToAsset } from "../../logic/assets"
import NumberFormat from "react-number-format"




/**
 * `<CurrencyBalance>` component.
 *
 * @function CurrencyBalance
 * @returns {React.ReactElement}
 */
const CurrencyBalance = ({ balance, preferredRate }) =>
    <NumberFormat
        value={nativeToAsset(
            balance,
            preferredRate
        )}
        displayType={"text"}
        thousandSeparator={true}
        decimalScale={2}
        fixedDecimalScale={true}
    />




// ...
export default connect(
    (state) => ({
        balance: state.StellarAccount.balance,
        preferredRate: state.ExchangeRates[state.Account.currency].rate,
    }),
)(CurrencyBalance)
