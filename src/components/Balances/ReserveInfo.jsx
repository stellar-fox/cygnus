import React from "react"
import { connect } from "react-redux"
import { Typography } from "@material-ui/core"
import { assetGlyph } from "../../lib/asset-utils"
import { nativeToAsset } from "../../logic/assets"
import { currentAccountReserve } from "../../lib/utils"
import { stellarLumenSymbol } from "../StellarFox/env"
import NumberFormat from "react-number-format"




const ReserveInfo = ({
    currency, preferredRate, subentryCount,
}) => {

    return <div style={{marginTop: "8px", marginRight: "8px"}}
        className="flex-box-col items-flex-end"
    >
        <Typography variant="h5" color="primary">
            Reserve: <span
                style={{ paddingRight: "3px" }}
                className="fade"
            >
                {assetGlyph(currency)}
            </span>
            <span className="fade tabular-nums">
                <NumberFormat
                    value={
                        nativeToAsset(
                            currentAccountReserve(subentryCount),
                            preferredRate
                        )
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={2}
                    fixedDecimalScale={true}
                />
            </span>
        </Typography>
        <Typography variant="h5" color="primary">
            <span className="fade-extreme tabular-nums">
                {stellarLumenSymbol} <NumberFormat
                    value={
                        currentAccountReserve(
                            subentryCount
                        )
                    }
                    displayType={"text"}
                    thousandSeparator={true}
                    decimalScale={7}
                    fixedDecimalScale={true}
                />
            </span>
        </Typography>
    </div>
}




// ...
export default connect(
    (state) => ({
        currency: state.Account.currency,
        preferredRate: state.ExchangeRates[state.Account.currency].rate,
        subentryCount: state.StellarAccount.subentryCount,
    })
)(ReserveInfo)
