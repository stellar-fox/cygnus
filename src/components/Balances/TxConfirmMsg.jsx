import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    emptyString,
    handleException,
    shorten,
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
    gravatar, gravatarSize, serviceFee, serviceFeeCurrency,
} from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import { liveNetAddr } from "../StellarFox/env"
import BigNumber from "bignumber.js"
import CheckIcon from "@material-ui/icons/Check"


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
        `${this.props.Balances.amount} ${
            this.props.Account.currency.toUpperCase()}`


    // ...
    receiveAmount = () =>
        this.state.contact.currency &&
            this.state.contact.currency !== this.props.Account.currency ?
            `${this.props.assetManager.exchangeRate(
                this.props.Balances.amount, this.state.contact.currency
            )
            } ${this.state.contact.currency.toUpperCase()}` : `${
                this.props.Balances.amount} ${
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

            const rateContact = new BigNumber(
                this.props.assetManager.exchangeRate(
                    1.00, this.props.Account.currency
                )
            )

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
        ({ classes, Account, Balances, publicKey, sequence, }) =>
            <Fragment>

                <div className="p-t p-b flex-box-row space-between">
                    <Typography align="center" color="primary" variant="body2">
                        Payment
                    </Typography>

                    <Typography align="center" color="primary" variant="body2">
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
                                variant="body2"
                            >
                                Sends: {this.sendAmount()}
                                <div className="micro text-primary fade-extreme">
                                    {Balances.amountNative} XLM
                                </div>
                            </Typography>
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
                                variant="body2"
                            >
                                Receives: {this.receiveAmount()}
                                <div className="micro text-primary fade-extreme">
                                    {Balances.amountNative} XLM
                                </div>
                            </Typography>
                        </div>
                    </div>
                    <div className="flex-box-col">
                        <div style={{ paddingBottom: 5, }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body2">
                                    Exchange Rate:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body2">
                                    {this.exchangeRate()}
                                </Typography>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 5, }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body2">
                                    You Send:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body2">
                                    {this.sendAmount()}
                                </Typography>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 5, }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body2">
                                    Payee Receives:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body2">
                                    {this.receiveAmount()}
                                </Typography>
                            </div>
                        </div>
                        <div style={{ paddingBottom: 5, }}>
                            <div className="flex-box-row space-between">
                                <Typography color="primary" variant="body2">
                                    Service Fee:<he.Nbsp /><he.Nbsp />
                                </Typography>
                                <Typography color="primary" variant="body2">
                                    {this.serviceFee(
                                        this.state.contact.currency
                                    )}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider classes={{ root: classes.divider, }} />

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
                                        Balances.memoText === emptyString() ?
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
                                            () => shorten(publicKey, 13),
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
                                        {shorten(nextSequenceNumber(sequence), 13)}
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="m-t border-error glass-error glass-error-text">
                    Action Required
                </div>

                <Typography align="center" color="primary" variant="body2">
                    When you are sure the info above is correct press
                    <he.Nbsp />
                    <CheckIcon
                        style={{
                            fontSize: "1.5rem",
                        }}
                    />
                    <he.Nbsp />
                    on the device to sign and send the transaction.
                </Typography>

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
        })
    )
)(TxConfirmMsg)
