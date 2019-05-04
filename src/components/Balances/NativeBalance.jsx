import React from "react"
import { connect } from "react-redux"
import { Typography } from "@material-ui/core"
import { assetGlyph } from "../../lib/asset-utils"
import { nativeToAsset } from "../../logic/assets"
import { stellarLumenSymbol } from "../StellarFox/env"
import NumberFormat from "react-number-format"
import CurrencyBalance from "./CurrencyBalance"



/**
 * `<NativeBalance>` component.
 *
 * @function NativeBalance
 * @returns {React.ReactElement}
 */
const NativeBalance = ({ balance, currency, preferredRate }) => {

    return <div style={{ zIndex: "1" }}>
        <div className="text-primary">
            <span className="fade currency-glyph">
                {assetGlyph(currency)}
            </span>
            <span className="p-l-medium balance tabular-nums">
                <CurrencyBalance />
            </span>
        </div>
        <Typography color="primary" variant="h5"
            className="fade-extreme tabular-nums"
        >
            {stellarLumenSymbol} <NumberFormat
                value={balance}
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={7}
                fixedDecimalScale={true}
            />
        </Typography>
        <Typography color="primary" variant="h5"
            className="fade-extreme tabular-nums"
        >{stellarLumenSymbol} 1 ≈ {
                assetGlyph(currency)
            } <NumberFormat
                value={
                    nativeToAsset("1.0000000", preferredRate)
                }
                displayType={"text"}
                thousandSeparator={true}
                decimalScale={2}
                fixedDecimalScale={true}
            />
        </Typography>
    </div>
}




// ...
export default connect(
    (state) => ({
        balance: state.StellarAccount.balance,
        currency: state.Account.currency,
        preferredRate: state.ExchangeRates[state.Account.currency].rate,
    })
)(NativeBalance)
