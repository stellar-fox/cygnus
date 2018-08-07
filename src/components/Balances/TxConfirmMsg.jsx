import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    emptyString,
    handleException,
} from "@xcmats/js-toolbox"
import {
    findContact,
    htmlEntities as he,
    pubKeyAbbrLedgerHQ,
    formatFullName,
} from "../../lib/utils"
import {
    gravatar, gravatarSize, serviceFee, serviceFeeCurrency,
} from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import { liveNetAddr } from "../StellarFox/env"



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


    // ...
    serviceFee = () =>
        this.state.contact.currency &&
            this.state.contact.currency !== this.props.Account.currency ?
            `${serviceFee} ${serviceFeeCurrency.toUpperCase()} ≈ ${
                this.props.assetManager.exchangeRate(
                    serviceFee, this.state.contact.currency
                )} ${this.state.contact.currency.toUpperCase()}` :
            `${serviceFee} ${serviceFeeCurrency.toUpperCase()}`


    // ...
    render = () => (
        ({ classes, Account, Balances, }) =>
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
                                    {this.serviceFee()}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Divider classes={{ root: classes.divider, }} />

                <Typography align="center" color="primary" variant="body2">
                    Please confirm that the following info is the same on your
                    device<he.Apos />s screen:
                </Typography>

                <div className="f-b p-t space-between">
                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-around gradiented">
                            <div>
                                <i className="text-primary material-icons">
                                    style
                                </i>
                            </div>
                            <div>
                                <Typography color="primary" variant="body1">
                                    Operation Type
                                </Typography>
                                <Typography color="primary" variant="body2">
                                    {Balances.transactionType}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-around gradiented">
                            <div>
                                <i className="text-primary material-icons">
                                    account_balance_wallet
                                </i>
                            </div>
                            <div>
                                <Typography align="center" color="primary"
                                    variant="body1"
                                >Amount</Typography>
                                <Typography align="center" color="primary"
                                    variant="body2"
                                >{`${Balances.amountNative} XLM`}</Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-around gradiented">
                            <div>
                                <i className="text-primary material-icons">
                                    gps_fixed
                                </i>
                            </div>
                            <div>
                                <Typography align="right" color="primary"
                                    variant="body1"
                                >Destination</Typography>
                                <Typography align="right" color="primary"
                                    variant="body2"
                                >{handleException(
                                        () => pubKeyAbbrLedgerHQ(Balances.payee),
                                        () => "Not Available")}</Typography>
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="f-b space-between p-t p-b">

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-around gradiented">
                            <div>
                                <i className="text-primary material-icons">
                                    speaker_notes
                                </i>
                            </div>
                            <div>
                                <Typography color="primary" variant="body1">
                                    Memo
                                </Typography>
                                <Typography color="primary" variant="body2">{
                                    Balances.memoText === emptyString() ?
                                        "Empty" : Balances.memoText
                                }</Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-around gradiented">
                            <div>
                                <i className="text-primary material-icons">
                                    credit_card
                                </i>
                            </div>
                            <div>
                                <Typography align="center" color="primary"
                                    variant="body1"
                                >Fee</Typography>
                                <Typography align="center" color="primary"
                                    variant="body2"
                                >0.000001 XLM</Typography>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-col items-flex-end">
                        <div className="flex-box-row items-centered border-around gradiented">
                            <div>
                                <i className="text-primary material-icons">
                                    public
                                </i>
                            </div>
                            <div>
                                <Typography align="right" color="primary"
                                    variant="body1"
                                >Network</Typography>
                                <Typography align="right" color="primary"
                                    variant="body2"
                                >
                                    {this.props.horizon === liveNetAddr ?
                                        "Public" : "Test"}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Typography align="center" color="primary" variant="body1">
                    When you are sure it is correct press
                    <span className="bigger text-primary">
                        <he.Nbsp /><he.Check />
                    </span>
                    on the device to sign your transaction and send it off.
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
        })
    )
)(TxConfirmMsg)
