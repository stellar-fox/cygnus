import React, { memo } from "react"
import { connect } from "react-redux"
import { CardHeader } from "@material-ui/core"
import { assetDescription } from "../../lib/asset-utils"
import ReserveInfo from "./ReserveInfo"
import BigNumber from "bignumber.js"




/**
 * `<BalanceSummaryHeader>` component.
 *
 * @module client-ui-components
 * @license Apache-2.0
 * @returns {React.ReactElement}
 */
const BalanceSummaryHeader = memo(({ athPrice, baseSign, baseSymbol, change,coinSymbol, currency }) => {
    const ATH = new BigNumber(athPrice).toFixed(2)
    const TICKER = <div>
        <span>{baseSymbol}/{coinSymbol} | ATH: {baseSign} {ATH} | </span>
        <span className={change < 0 ? "red" : "green"}>{change}%</span> THIS MONTH
    </div>
    const TITLE = <div>
        <span className="washed-out">Current balance quoted in: </span>
        <span>{assetDescription(currency)}</span>
    </div>
    return <CardHeader
        style={{ zIndex: 1 }}
        title={TITLE}
        subheader={TICKER}
        action={<ReserveInfo />}
    />
})

export default connect (
    (state) => ({
        currency: state.Account.currency,
        athDate: state.ExchangeRates.coinData.coin.allTimeHigh.timestamp || "",
        athPrice: state.ExchangeRates.coinData.coin.allTimeHigh.price || "",
        baseSign: state.ExchangeRates.coinData.base.sign || "",
        baseSymbol: state.ExchangeRates.coinData.base.symbol || "",
        change: state.ExchangeRates.coinData.coin.change || "",
        coinSymbol: state.ExchangeRates.coinData.coin.symbol || "",
    })
)(BalanceSummaryHeader)
