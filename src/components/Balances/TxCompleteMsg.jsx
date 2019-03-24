import React, { Fragment } from "react"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import NumberFormat from "react-number-format"
import { Typography } from "@material-ui/core"
import { assetGlyph } from "../../lib/asset-utils"




// ...
export default connect(
    // map state to props.
    (state) => ({
        balances: state.Balances,
        currency: state.Account.currency,
    })
)(
    ({ balances, currency }) =>
        <Fragment>

            <div className="m-t flex-box-col content-centered items-centered">
                <Typography
                    style={{ lineHeight: "2.5rem" }}
                    noWrap
                    variant="h2"
                    color="primary"
                >
                    Transaction Summary
                </Typography>
            </div>

            <div className="m-t flex-box-col ledger-display">

                <div className="flex-box-row space-between ledger-display-item">
                    <Typography noWrap color="primary" variant="caption">
                        Amount Sent:
                    </Typography>
                    <Typography noWrap color="primary" variant="caption">
                        {assetGlyph(currency)} <NumberFormat
                            value={balances.amount}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                    </Typography>
                </div>

                <div className="flex-box-row space-between ledger-display-item">
                    <Typography noWrap color="primary" variant="caption">
                        Destination Address:
                    </Typography>
                    <Typography noWrap color="primary" variant="caption">
                        {string.shorten(balances.payeeAddress, 35)}
                    </Typography>
                </div>

                <div className="flex-box-row space-between ledger-display-item">
                    <Typography noWrap color="primary" variant="caption">
                        Memo Text:
                    </Typography>
                    <Typography noWrap color="primary" variant="caption">
                        {balances.memoText}
                    </Typography>
                </div>

                <div className="flex-box-row space-between ledger-display-item">
                    <Typography noWrap color="primary" variant="caption">
                        Transaction ID:
                    </Typography>
                    <Typography noWrap color="primary" variant="caption">
                        {balances.paymentId}
                    </Typography>
                </div>

            </div>

            <div className="p-t flex-box-col items-centered">
                <Typography variant="h5" color="primary" align="center">
                    Funds have arrived to the destination account.
                </Typography>
                <Typography variant="h6" color="primary" noWrap>
                    Thank you for using Cygnus.
                </Typography>
            </div>


        </Fragment>
)
