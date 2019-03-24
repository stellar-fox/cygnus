import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    handleException,
    string,
} from "@xcmats/js-toolbox"
import {
    calculateTxFee,
    findContact,
    pubKeyAbbrLedgerHQ,
    formatFullName,
    nextSequenceNumber,
} from "../../lib/utils"
import {
    gravatar,
    gravatarSize,
    stellarLumenSymbol,
} from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import { liveNetAddr } from "../StellarFox/env"
import { assetToAsset, nativeToAsset } from "../../logic/assets"
import { getExchangeRate } from "../../thunks/assets"
import { assetGlyph } from "../../lib/asset-utils"




// ...
const styles = (theme) => ({
    avatar: {
        borderRadius: 3,
        width: 60,
        height: 60,
        border: `1px solid ${theme.palette.primary.fade}`,
        marginBottom: "3px",
    },
    avatarImage: {
        borderRadius: "5px",
        border: `3px solid ${theme.palette.secondary.light}`,
        opacity: "0.85",
    },
    divider: {
        backgroundColor: theme.palette.primary.fade,
        marginBottom: theme.spacing.unit,
    },
})




// ...
class TxConfirmMsg extends Component {

    state = {
        contact: {},
    }


    // ...
    componentDidMount = () => {
        const foundContact = findContact(
            this.props.Contacts[this.props.Balances.contactType] || [],
            this.props.Balances.contactId,
            this.props.Balances.contactType === "external" ?
                true : false
        )

        if (this.props.payeeCurrency !== this.props.currency) {
            this.props.getExchangeRate(this.props.payeeCurrency)
            this.setState({
                exchangeRate: assetToAsset(
                    this.props.preferredRate,
                    this.props.payeeRate
                ),
            })
        }

        if (foundContact) {
            this.setState({
                contact: foundContact,
                receives: nativeToAsset(
                    this.props.Balances.amountNative,
                    this.props.payeeRate
                ),
                receiverCurrency: assetGlyph(this.props.payeeCurrency),
            })
        }

    }




    // ...
    render = () => (
        ({
            classes, currency, Balances, maxTime, minTime,
            payeeCurrency, publicKey, sequence,
        }) =>
            <Fragment>

                <div className="m-t m-b flex-box-row content-centered space-around">
                    <div className="m-t flex-box-col content-centered items-centered">

                        <Typography
                            style={{ lineHeight: "2.5rem" }}
                            noWrap
                            variant="h3"
                            color="primary"
                        >
                            You are sending:
                        </Typography>

                        <Typography noWrap variant="h3" color="primary">
                            {assetGlyph(currency)} {Balances.amount || "0.00"}
                        </Typography>

                        <Typography>
                            <span className="micro text-primary fade-extreme">
                                {stellarLumenSymbol} {Balances.amountNative || "0.0000000"}
                            </span>
                        </Typography>

                        {payeeCurrency !== currency &&
                        <Typography variant="h5" color="primary">
                            Exchange Rate: {assetGlyph(currency)} 1 ≈ {assetGlyph(payeeCurrency)} {this.state.exchangeRate}
                        </Typography>
                        }

                    </div>


                    <div className="m-t flex-box-col content-centered items-centered">
                        <Avatar classes={{
                            root: classes.avatar, img: classes.avatarImage,
                        }} src={`${gravatar}${
                            this.state.contact.email_md5}?${
                            gravatarSize}&d=robohash`}
                        />

                        <Typography align="center" color="primary"
                            variant="body2"
                        >
                            {formatFullName(
                                this.state.contact.first_name,
                                this.state.contact.last_name
                            )}
                        </Typography>

                        <Typography align="center" color="primary"
                            variant="h4" noWrap
                        >
                            Receives: {this.state.receives} {this.state.receiverCurrency}
                        </Typography>

                        <Typography noWrap>
                            <span className="micro text-primary fade-extreme">
                                {stellarLumenSymbol} {Balances.amountNative || "0.0000000"}
                            </span>
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
                        Confirm that the information below is the same as on
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
                            Send:
                        </Typography>
                        <Typography noWrap color="primary" variant="caption">
                            {`${Balances.amountNative || "0.0000000"} XLM`}
                        </Typography>
                    </div>

                    <div className="flex-box-row space-between ledger-display-item">
                        <Typography noWrap color="primary" variant="caption">
                            Destination:
                        </Typography>
                        <Typography noWrap color="primary" variant="caption">
                            {handleException(
                                () => pubKeyAbbrLedgerHQ(Balances.payee),
                                () => "Not Available")}
                        </Typography>
                    </div>

                    <div className="flex-box-row space-between ledger-display-item">
                        <Typography noWrap color="primary" variant="caption">
                            Memo Text:
                        </Typography>
                        <Typography noWrap color="primary" variant="caption">
                            {Balances.memoText}
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
                            {this.props.horizon === liveNetAddr ?
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
    )(this.props)
}




// ...
export default compose (
    withStyles(styles),
    connect(
        (state) => ({
            Balances: state.Balances,
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
        }),
        (dispatch) => bindActionCreators({
            getExchangeRate,
        }, dispatch)
    )
)(TxConfirmMsg)
