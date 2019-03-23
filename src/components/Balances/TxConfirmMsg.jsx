import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    handleException,
    string,
} from "@xcmats/js-toolbox"
import {
    calculateTxFee,
    findContact,
    htmlEntities as he,
    pubKeyAbbrLedgerHQ,
    formatFullName,
    nextSequenceNumber,
} from "../../lib/utils"
import {
    gravatar,
    gravatarSize,
    serviceFee,
    serviceFeeCurrency,
    stellarLumenSymbol,
} from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import { liveNetAddr } from "../StellarFox/env"
import BigNumber from "bignumber.js"
import { nativeToAsset } from "../../logic/assets"



// ...
const styles = (theme) => ({
    avatar: {
        borderRadius: 3,
        width: 96,
        height: 96,
        border: `2px solid ${theme.palette.primary.fade}`,
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
        const found = findContact(
            this.props.Contacts[this.props.Balances.contactType] || [],
            this.props.Balances.contactId,
            this.props.Balances.contactType === "external" ?
                true : false
        )
        this.setState({
            contact: found ? found : {},
        })
    }


    // ...
    sendAmount = () =>
        `${this.props.Balances.amount || "0.00"} ${
            this.props.Account.currency.toUpperCase()}`


    // ...
    receiveAmount = () =>
        this.state.contact.currency &&
            this.state.contact.currency !== this.props.Account.currency ?
            `${this.props.assetManager.exchangeRate(
                this.props.Balances.amount, this.state.contact.currency
            )
            } ${this.state.contact.currency.toUpperCase()}` : `${
                this.props.Balances.amount || "0.00"} ${
                this.props.Account.currency.toUpperCase()}`


    // ...
    exchangeRate = () =>
        this.state.contact.currency &&
            this.state.contact.currency !== this.props.Account.currency ?
            `1.00 ${this.props.Account.currency.toUpperCase()} ≈ ${
                this.props.assetManager.exchangeRate(1.00,
                    this.state.contact.currency
                )} ${this.state.contact.currency.toUpperCase()}` :
            "N/A"


    /**
     * Returns service fee string in the following format:
     * 1.40 THB ≈ 0.55 EUR
     */
    serviceFee = (contactCurrency) => {

        const sfee = new BigNumber(serviceFee)

        if (contactCurrency) {
            const rate = new BigNumber(this.props.assetManager.exchangeRate(
                1.00, contactCurrency))

            const rateContact = nativeToAsset("1.00", this.props.preferredRate)


            return contactCurrency !== this.props.Account.currency ?
                `${sfee.dividedBy(rate).toFixed(2)} ${
                    this.props.Account.currency.toUpperCase()} ≈ ${
                    sfee.dividedBy(rateContact).toFixed(2)} ${
                    contactCurrency.toUpperCase()}` :
                `${serviceFee} ${serviceFeeCurrency.toUpperCase()}`
        }

        return `${serviceFee} ${serviceFeeCurrency.toUpperCase()}`
    }

    // ...
    render = () => (
        ({ classes, Account, Balances, publicKey, sequence }) =>
            <Fragment>

                <div className="p-t p-b flex-box-row space-between">
                    <Typography align="center" color="primary" variant="body1">
                        Payment
                    </Typography>

                    <Typography align="center" color="primary" variant="body1">
                        Cost Breakdown
                    </Typography>
                </div>

                <div className="flex-box-row space-between">
                    <div className="flex-box-row items-flex-start">
                        <div className="f-b-col-c">

                            <Avatar classes={{
                                root: classes.avatar, img: classes.avatarImage,
                            }} src={`${gravatar}${Account.gravatar}?${
                                gravatarSize}&d=robohash`
                            }
                            />

                            <Typography align="center" color="primary"
                                variant="body1"
                            >
                                {formatFullName(
                                    Account.firstName, Account.lastName
                                )}
                            </Typography>

                            <Typography align="center" color="primary"
                                variant="body1"
                            >
                                Sends: {this.sendAmount()}

                            </Typography>

                            <div className="micro text-primary fade-extreme p-b-small">
                                {stellarLumenSymbol} {Balances.amountNative || "0.0000000"}
                            </div>

                        </div>

                        <span className="text-primary" style={{
                            padding: "0 2rem", paddingBottom: "3rem",
                            fontSize: "4rem",
                        }}
                        >→</span>
                        <div className="f-b-col-c">

                            <Avatar classes={{
                                root: classes.avatar, img: classes.avatarImage,
                            }} src={`${gravatar}${
                                this.state.contact.email_md5}?${
                                gravatarSize}&d=robohash`}
                            />

                            <Typography align="center" color="primary"
                                variant="body1"
                            >
                                {formatFullName(
                                    this.state.contact.first_name,
                                    this.state.contact.last_name
                                )}
                            </Typography>

                            <Typography align="center" color="primary"
                                variant="body1"
                            >
                                Receives: {this.receiveAmount()}
                            </Typography>

                            <div className="micro text-primary fade-extreme p-b-small">
                                {stellarLumenSymbol} {Balances.amountNative || "0.0000000"}
                            </div>

                        </div>
                    </div>
                    <div className="flex-box-col">
                        <div style={{ paddingBottom: 5 }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body1">
                                    Exchange Rate:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body1">
                                    {this.exchangeRate()}
                                </Typography>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 5 }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body1">
                                    You Send:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body1">
                                    {this.sendAmount()}
                                </Typography>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 5 }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body1">
                                    Payee Receives:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body1">
                                    {this.receiveAmount()}
                                </Typography>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 5 }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body1">
                                    Service Fee:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body1">
                                    {this.serviceFee(
                                        this.state.contact.currency
                                    )}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider classes={{ root: classes.divider }} />

                <Typography align="center" color="primary" variant="body1">
                    Please confirm that the following info is the same on your
                    device<he.Apos />s screen:
                </Typography>

                <div className="p-t flex-box-row space-around">

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography align="center" color="primary"
                                    variant="caption"
                                >Send</Typography>
                                <Typography align="center">
                                    <span className="glass-text">
                                        {`${Balances.amountNative} XLM`}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography align="center" color="primary"
                                    variant="caption"
                                >Destination</Typography>
                                <Typography align="center">
                                    <span className="glass-text">{
                                        handleException(
                                            () => pubKeyAbbrLedgerHQ(Balances.payee),
                                            () => "Not Available")}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography color="primary" align="center"
                                    variant="caption"
                                >
                                    Memo Text
                                </Typography>
                                <Typography align="center">
                                    <span className="glass-text">{
                                        Balances.memoText === string.empty() ?
                                            <he.Nbsp /> : Balances.memoText
                                    }</span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography align="center" color="primary"
                                    variant="caption"
                                >Fee</Typography>
                                <Typography align="center">
                                    <span className="glass-text">
                                        {calculateTxFee(1)}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="f-b space-between p-t p-b">

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography align="center" color="primary"
                                    variant="caption"
                                >Network</Typography>
                                <Typography align="center">
                                    <span className="glass-text">
                                        {this.props.horizon === liveNetAddr ?
                                            "Public" : "Test"}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography align="center" color="primary"
                                    variant="caption"
                                >Transaction Source</Typography>
                                <Typography align="center">
                                    <span className="glass-text">
                                        {handleException(
                                            () => string.shorten(publicKey, 13),
                                            () => "Not Available")}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-primary glass">
                            <div>
                                <Typography align="center" color="primary"
                                    variant="caption"
                                >Sequence Number</Typography>
                                <Typography align="center">
                                    <span className="glass-text">
                                        {
                                            string.shorten(
                                                nextSequenceNumber(sequence),
                                                13
                                            )
                                        }
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex-box-row items-centered m-t">
                    <div className="border-error glass-error glass-error-text">
                        Action Required
                    </div>
                    <he.Nbsp /><he.Nbsp />
                    <Typography style={{fontWeight: 600}} color="primary" variant="h5">
                        When you are sure the info above is correct
                        press <span style={{fontSize: "1rem"}}>✓</span>
                        on the device to sign and send the transaction.
                    </Typography>
                </div>


            </Fragment>
    )(this.props)
}


export default compose (
    withStyles(styles),
    connect(
        (state) => ({
            Account: state.Account,
            Balances: state.Balances,
            Contacts: state.Contacts,
            horizon: state.StellarAccount.horizon,
            publicKey: state.StellarAccount.accountId,
            sequence: state.StellarAccount.sequence,
            preferredRate: state.ExchangeRates[state.Account.currency].rate,
        })
    )
)(TxConfirmMsg)
