import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Divider,
    Typography,
} from "@material-ui/core"
import {
    calculateTxFee,
    nextSequenceNumber,
} from "../../lib/utils"
import { liveNetAddr } from "../StellarFox/env"
import {
    handleException,
    string,
} from "@xcmats/js-toolbox"




/**
 * Cygnus.
 *
 * Balance summary card.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<TxConfirm>` component.
 *
 * @function TxConfirm
 * @returns {React.ReactElement}
 */
const TxConfirm = ({
    classes, data, fingerprintUserData, horizon, maxTime, minTime, publicKey,
    sequence,
}) => {

    return <Fragment>
        <div className="m-t m-b flex-box-row content-centered space-around">
            <div className="m-t flex-box-col content-centered items-centered">

                <Typography
                    style={{ lineHeight: "2.5rem", marginBottom: "1rem" }}
                    noWrap
                    variant="h3"
                    color="primary"
                >
                    You are adding this data to your account:
                </Typography>

                <div className="flex-box-row space-between ledger-display-item">
                    <Typography noWrap color="primary" variant="caption">
                        {btoa(fingerprintUserData)}
                    </Typography>
                </div>

                <Typography
                    style={{ marginTop: "1rem" }}
                    variant="h5"
                    color="primary"
                    align="center"
                >
                    This fingerprint corresponds to your user profile data and
                    ensures that your profile is tamper proof.
                </Typography>

            </div>
        </div>

        <Divider classes={{ root: classes.divider }} />

        <div className="m-t flex-box-col content-centered items-centered m-t">
            <div className="border-error glass-error glass-error-text">
                Action Required
            </div>
            <Typography
                style={{ fontWeight: 600, marginTop: "10px" }}
                color="primary"
                variant="h5"
                noWrap
            >
                Confirm transaction information on
                your device display.
            </Typography>
            <Typography
                style={{ fontWeight: 600 }}
                color="primary"
                variant="h5"
                noWrap
            >
                Then press <span style={{fontSize: "1rem"}}>✓</span>
                on the device to sign and send the transaction.
            </Typography>
        </div>

        <div className="m-t flex-box-col ledger-display">

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Set Data:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {data}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Data Value:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {string.shorten(
                        btoa(fingerprintUserData),
                        25
                    )}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Memo:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    [none]
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Fee:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {calculateTxFee(1)}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Network:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {horizon === liveNetAddr ?
                        "Public" : "Test"}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Time bounds from:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {minTime}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Time bounds to:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {maxTime}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Transaction Source:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {handleException(
                        () => string.shorten(publicKey, 13),
                        () => "Not Available")}
                </Typography>
            </div>

            <div className="flex-box-row space-between ledger-display-item">
                <Typography noWrap color="primary" variant="caption">
                    Sequence Number:
                </Typography>
                <Typography noWrap color="primary" variant="caption">
                    {string.shorten(
                        nextSequenceNumber(sequence), 13)}
                </Typography>
            </div>

        </div>

    </Fragment>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        divider: {
            backgroundColor: theme.palette.primary.fade,
            marginBottom: theme.spacing.unit,
        },
    })),
    connect(
        (state) => ({
            memoText: state.Balances.memoText,
            Contacts: state.Contacts,
            currency: state.Account.currency,
            payeeCurrency: state.Balances.payeeCurrency,
            horizon: state.StellarAccount.horizon,
            publicKey: state.StellarAccount.accountId,
            sequence: state.StellarAccount.sequence,
            preferredRate: state.ExchangeRates[state.Account.currency].rate,
            payeeRate: state.ExchangeRates[state.Balances.payeeCurrency].rate,
            minTime: state.Transaction.timeBounds ? state.Transaction.timeBounds.minTime : "0",
            maxTime: state.Transaction.timeBounds ? state.Transaction.timeBounds.maxTime : "0",
            fingerprintUserData: state.Account.fingerprintUserData,
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(TxConfirm)
