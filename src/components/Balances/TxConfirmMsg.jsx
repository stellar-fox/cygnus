import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import {
    List,
    ListItem,
} from "material-ui/List"
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
                <div className="p-t centered">
                    <Typography align="center" color="primary" variant="title">
                        Transaction
                    </Typography>
                    <div style={{alignItems: "center", }}
                        className="f-b center p-t-medium p-b-large"
                    >
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
                            fontSize: "4rem", }}
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
                    <Typography align="center" color="primary" variant="title">
                        Cost Breakdown
                    </Typography>
                    <div style={{ alignItems: "center", }}
                        className="f-b-col-c p-t-medium p-b-small"
                    >
                        <div style={{width: "60%", marginBottom: "5px", }}
                            className="f-b space-between"
                        >
                            <Typography color="primary" variant="body2">
                                Exchange Rate:
                            </Typography>
                            <Typography color="primary" variant="body2">
                                {this.exchangeRate()}
                            </Typography>
                        </div>
                        <div style={{ width: "60%", marginBottom: "5px", }}
                            className="f-b space-between"
                        >
                            <Typography color="primary" variant="body2">
                                You Send:
                            </Typography>
                            <Typography color="primary" variant="body2">
                                {this.sendAmount()}
                            </Typography>
                        </div>
                        <div style={{ width: "60%", marginBottom: "5px", }}
                            className="f-b space-between"
                        >
                            <Typography color="primary" variant="body2">
                                Payee Receives:
                            </Typography>
                            <Typography color="primary" variant="body2">
                                {this.receiveAmount()}
                            </Typography>
                        </div>
                        <div style={{ width: "60%", marginBottom: "5px", }}
                            className="f-b space-between"
                        >
                            <Typography color="primary" variant="body2">
                                Service Fee:
                            </Typography>
                            <Typography color="primary" variant="body2">
                                {this.serviceFee()}
                            </Typography>
                        </div>
                    </div>
                </div>
                <Divider classes={{ root: classes.divider, }} />
                <Typography align="center" color="primary" variant="body2">
                    Please confirm that the following info is the same on your
                    device<he.Apos />s screen:
                </Typography>

                <div className="f-b space-around">
                    <List>
                        <ListItem
                            disabled={true}
                            primaryText="Operation Type"
                            secondaryText={Balances.transactionType}
                            leftIcon={
                                <i className="text-primary material-icons">
                                    style
                                </i>
                            }
                        />
                        <ListItem
                            disabled={true}
                            primaryText="Amount"
                            secondaryText={`${Balances.amountNative} XLM`}
                            leftIcon={
                                <i className="text-primary material-icons">
                                    account_balance_wallet
                                </i>
                            }
                        />
                        <ListItem
                            disabled={true}
                            primaryText="Destination"
                            secondaryText={
                                handleException(
                                    () => pubKeyAbbrLedgerHQ(Balances.payee),
                                    () => "Not Available"
                                )
                            }
                            leftIcon={
                                <i className="text-primary material-icons">
                                    gps_fixed
                                </i>
                            }
                        />
                    </List>
                    <List>
                        <ListItem
                            disabled={true}
                            primaryText="Memo"
                            secondaryText={
                                Balances.memoText === emptyString() ?
                                    "Empty" : Balances.memoText
                            }
                            leftIcon={
                                <i className="text-primary material-icons">
                                    speaker_notes
                                </i>
                            }
                        />
                        <ListItem
                            disabled={true}
                            primaryText="Fee"
                            secondaryText="0.000001 XLM"
                            leftIcon={
                                <i className="text-primary material-icons">
                                    credit_card
                                </i>
                            }
                        />
                        <ListItem
                            disabled={true}
                            primaryText="Network"
                            secondaryText="Test"
                            leftIcon={
                                <i className="text-primary material-icons">
                                    public
                                </i>
                            }
                        />
                    </List>
                </div>
                <div className="p-b centered">
                    When you are sure it is correct press
                    <span className="bigger text-primary"><he.Check /></span>
                    on the device to sign your transaction and send it off.
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
        })
    )
)(TxConfirmMsg)
