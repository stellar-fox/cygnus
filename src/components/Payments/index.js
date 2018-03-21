import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import BigNumber from "bignumber.js"

import {
    pubKeyAbbr,
    utcToLocaleDateTime,
    getAssetCode,
    formatAmount,
    StellarSdk,
} from "../../lib/utils"
import { emoji } from "../../env"
import {
    gravatarLink,
} from "../../lib/deneb"
import {
    setAccountPayments,
    setAccountTransactions,
    setStreamer,
    accountExistsOnLedger,
    accountMissingOnLedger,
    setTab,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
} from "../../actions/index"

import {
    Tabs,
    Tab,
} from "material-ui/Tabs"
import {
    List,
    ListItem,
    makeSelectable,
} from "material-ui/List"
import Avatar from "material-ui/Avatar"
import IconButton from "material-ui/IconButton"
import SnackBar from "../../frontend/SnackBar"
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from "material-ui/Table"

import "./index.css"




// ...
const wrapState = (ComposedComponent) =>
    class SelectableList extends Component {

        // ...
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        }

        // ...
        componentWillMount = () =>
            this.setState({
                selectedIndex: this.props.defaultValue,
            })

        // ...
        handleRequestChange = (_event, index) =>
            this.setState({
                selectedIndex: index,
            })

        // ...
        render = () =>
            <ComposedComponent
                value={this.state.selectedIndex}
                onChange={this.handleRequestChange}
            >
                {this.props.children}
            </ComposedComponent>

    }


// ...
const SelectableList = wrapState(makeSelectable(List))




// ...
const styles = {
    headline: {
        fontSize: 24,
        marginBottom: 12,
        fontWeight: 400,
    },
    tab: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
        color: "rgba(244,176,4,0.9)",
    },
    inkBar: {
        backgroundColor: "rgba(244,176,4,0.8)",
    },
    container: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
    },
    table: {
        backgroundColor: "rgb(15,46,83)",
    },
    tooltip: {
        backgroundColor: "rgba(244,176,4,0.8)",
        fontSize: "0.9rem",
    },
}




// <Payments> component
class Payments extends Component {

    // ...
    static contextTypes = {
        loginManager: PropTypes.object,
    }


    // ...
    state = {
        cursorLeft: null,
        cursorRight: null,
        prevDisabled: false,
        nextDisabled: false,
        txCursorLeft: null,
        txCursorRight: null,
        txNextDisabled: false,
        txPrevDisabled: false,
        tabSelected: "1",
        paymentDetails: {
            txid: null,
            created_at: null,
            memo: "",
            effects: [],
            selectedPaymentId: null,
        },
        sbPayment: false,
        sbPaymentAmount: null,
        sbPaymentAssetCode: null,
        sbNoMorePayments: false,
        sbNoMoreTransactions: false,
    }


    // ...
    componentWillUnmount = () =>
        this.props.accountInfo.streamer.call(this)


    // ...
    componentDidMount = () => {
        this.props.setModalLoading()
        this.props.updateLoadingMessage({
            message: "Loading payments data ...",
        })
        this.props.setStreamer(this.paymentsStreamer.call(this))

        let server = new StellarSdk.Server(this.props.accountInfo.horizon)
        server
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("desc")
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises =
                    paymentsResult.records.map((r) => {
                        let link = ""
                        switch (r.type) {
                            case "create_account":
                                if (
                                    r.funder === this.props.appAuth.publicKey
                                ) {
                                    link = gravatarLink(r.account)
                                } else {
                                    link = gravatarLink(r.funder)
                                }
                                break

                            // payment
                            default:
                                if(r.to === this.props.appAuth.publicKey) {
                                    link = gravatarLink(r.from)
                                } else {
                                    link = gravatarLink(r.to)
                                }
                                break
                        }
                        return link
                    })

                Promise.all(gravatarLinkPromises).then((links) => {
                    links.forEach((link, index) => {
                        paymentsResult.records[index].gravatar = link.link
                        paymentsResult.records[index].firstName = link.firstName
                        paymentsResult.records[index].lastName = link.lastName
                        paymentsResult.records[index].email = link.email
                        paymentsResult.records[index].alias = link.alias
                        paymentsResult.records[index].domain = link.domain
                    })
                    this.props.setAccountPayments(paymentsResult)
                    this.updateCursors(paymentsResult.records)
                    paymentsResult.records[0].effects().then((effects) => {
                        paymentsResult.records[0].transaction().then((tx) => {
                            this.setState({
                                paymentDetails: {
                                    txid: paymentsResult.records[0].id,
                                    created_at:
                                        paymentsResult.records[0].created_at,
                                    effects: effects._embedded.records,
                                    memo: tx.memo,
                                    selectedPaymentId:
                                        paymentsResult.records[0].id,
                                },
                            })
                            this.props.setModalLoaded()
                        })
                    })
                })
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })
    }


    // ...
    noMorePaymentsNotice = (state) =>
        this.setState(
            { sbNoMorePayments: true, },
            (_prevState) => this.setState(state)
        )


    // ...
    noMoreTransactionsNotice = (state) =>
        this.setState({ sbNoMoreTransactions: true, },
            (_prevState) => this.setState(state)
        )


    // ...
    handleNoMorePaymentsSnackBarClose = () =>
        this.setState({ sbNoMorePayments: false, })


    // ...
    handleNoMoreTransactionsSnackBarClose = () =>
        this.setState({ sbNoMoreTransactions: false, })


    // ...
    paymentsStreamer = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)
        return server
            .payments()
            .cursor("now")
            .stream({
                onmessage: (message) => {

                    /*
                    * Payment to fund a new account.
                    */
                    if (
                        message.type === "create_account" &&
                        message.source_account === this.props.appAuth.publicKey
                    ) {
                        this.updateAccount.call(this)
                        this.setState({
                            sbPayment: true,
                            sbPaymentText:
                                `Payment sent to new account [${
                                    pubKeyAbbr(message.account)
                                }]: `,
                            sbPaymentAmount:
                                this.convertToFiat(message.starting_balance),
                            sbPaymentAssetCode:
                                this.props.accountInfo.currency.toUpperCase(),
                        })
                    }


                    /*
                     * Initial funding of own account.
                     */
                    if (
                        message.type === "create_account" &&
                        message.account === this.props.appAuth.publicKey
                    ) {
                        this.updateAccount.call(this)
                        this.setState({
                            sbPayment: true,
                            sbPaymentText: "Account Funded: ",
                            sbPaymentAmount:
                                this.convertToFiat(message.starting_balance),
                            sbPaymentAssetCode:
                                this.props.accountInfo.currency.toUpperCase(),
                        })
                    }

                    /*
                     * Receiving payment.
                     */
                    if (
                        message.type === "payment" &&
                        message.to === this.props.appAuth.publicKey
                    ) {
                        this.updateAccount.call(this)
                        this.setState({
                            sbPayment: true,
                            sbPaymentText: "Payment Received: ",
                            sbPaymentAmount: formatAmount(
                                message.amount,
                                this.props.accountInfo.precision
                            ),
                            sbPaymentAssetCode:
                                message.asset_type === "native"
                                    ? "XLM"
                                    : message.asset_code,
                        })
                    }

                    /*
                     * Sending payment.
                     */
                    if (
                        message.type === "payment" &&
                        message.from === this.props.appAuth.publicKey
                    ) {
                        this.updateAccount.call(this)
                        this.setState({
                            sbPayment: true,
                            sbPaymentText: "Payment Sent: ",
                            sbPaymentAmount: formatAmount(
                                message.amount,
                                this.props.accountInfo.precision
                            ),
                            sbPaymentAssetCode:
                                message.asset_type === "native"
                                    ? "XLM"
                                    : message.asset_code,
                        })
                    }
                },
            })
    }


    // ...
    updateAccount = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)
        server
            .loadAccount(this.props.appAuth.publicKey)
            .catch(StellarSdk.NotFoundError, function (_err) {
                throw new Error("The destination account does not exist!")
            })
            .then(
                (account) => {
                    this.props.accountExistsOnLedger({ account, })
                    server
                        .payments()
                        .limit(5)
                        .forAccount(this.props.appAuth.publicKey)
                        .order("desc")
                        .call()
                        .then((paymentsResult) => {
                            const gravatarLinkPromises =
                                paymentsResult.records.map((r) => {
                                    let link = ""
                                    switch (r.type) {
                                        case "create_account":
                                            if (
                                                r.funder ===
                                                    this.props
                                                        .appAuth.publicKey
                                            ) {
                                                link = gravatarLink(r.account)
                                            } else {
                                                link = gravatarLink(r.funder)
                                            }
                                            break

                                        // payment
                                        default:
                                            if (
                                                r.to ===
                                                    this.props
                                                        .appAuth.publicKey
                                            ) {
                                                link = gravatarLink(r.from)
                                            } else {
                                                link = gravatarLink(r.to)
                                            }
                                            break
                                    }
                                    return link
                                })

                            Promise.all(gravatarLinkPromises).then((links) => {
                                links.forEach((link, index) => {
                                    paymentsResult.records[index].gravatar = link.link
                                    paymentsResult.records[index].firstName = link.firstName
                                    paymentsResult.records[index].lastName = link.lastName
                                    paymentsResult.records[index].email = link.email
                                    paymentsResult.records[index].alias = link.alias
                                    paymentsResult.records[index].domain = link.domain
                                })
                                this.props.setAccountPayments(paymentsResult)
                                this.updateCursors(paymentsResult.records)
                                paymentsResult.records[0].effects().then((effects) => {
                                    paymentsResult.records[0].transaction().then((tx) => {
                                        this.setState({
                                            paymentDetails: {
                                                txid:
                                                    paymentsResult
                                                        .records[0].id,
                                                created_at:
                                                    paymentsResult
                                                        .records[0].created_at,
                                                effects: effects
                                                    ._embedded.records,
                                                memo: tx.memo,
                                                selectedPaymentId:
                                                    paymentsResult
                                                        .records[0].id,
                                            },
                                        })
                                        this.props.setModalLoaded()
                                    })
                                })
                            })
                        })
                },
                (_e) => this.props.accountMissingOnLedger()
            )
    }


    // ...
    handlePaymentSnackBarClose = () =>
        this.setState({ sbPayment: false, })


    // ...
    handleTabSelect = (_, value) => {
        this.props.setTab({ payments: value, })
        this.setState({
            tabSelected: value,
        })
        if (
            value === "2" &&
            this.state.txCursorLeft === null &&
            this.state.txCursorRight === null
        ) {
            let server = new StellarSdk.Server(this.props.accountInfo.horizon)
            server
                .transactions()
                .forAccount(this.props.appAuth.publicKey)
                .order("desc")
                .limit(5)
                .call()
                .then((transactionsResult) => {
                    this.props.setAccountTransactions(transactionsResult)
                    this.updateTransactionsCursors(transactionsResult.records)
                })
                .catch(function (err) {
                    // eslint-disable-next-line no-console
                    console.log(err)
                })
        }
    }


    // ...
    handlePaymentClick = (payment, paymentId) =>
        payment.effects().then((effects) =>
            payment.transaction().then((tx) =>
                this.setState({
                    paymentDetails: {
                        txid: payment.id,
                        created_at: payment.created_at,
                        effects: effects._embedded.records,
                        memo: tx.memo,
                        selectedPaymentId: paymentId,
                    },
                })
            )
        )


    // ...
    decodeEffectType = (effect, index) => {
        let humanizedEffectType = ""
        const icon = `filter_${index + 1}`

        switch (effect.type) {
            case "account_created":
                humanizedEffectType = (
                    <div>
                        <div className="flex-row">
                            <div>
                                <i className="material-icons">{icon}</i>
                                <span>New Acccount Created </span>
                                <span className="account-direction">
                                    {effect.account ===
                                    this.props.appAuth.publicKey
                                        ? "Yours"
                                        : "Theirs"}
                                </span>
                            </div>
                            <div className="f-e-col">
                                <div>
                                    <span className="credit">
                                        {" "}&#x0002B;{" "}
                                        {this.getCurrencyGlyph(
                                            this.props.accountInfo.currency
                                        )}{" "}
                                        {this.convertToFiat(
                                            effect.starting_balance
                                        )}
                                    </span>
                                </div>
                                <div className="fade-extreme">
                                    <span className="micro-font">
                                        {effect.starting_balance}
                                    </span>{" "}
                                    <span className="pico-font small-caps">
                                        XLM
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="payment-details-body">
                            <div>
                                <span className="payment-details-account">
                                    {pubKeyAbbr(effect.account)}
                                </span>
                                <div className="payment-details-fieldset">
                                    <div className="payment-details-memo">
                                        <span className="smaller">Memo:</span>
                                        {" "}
                                        {this.state.paymentDetails.memo}
                                    </div>
                                    <div className="payment-details-id">
                                        ID: {effect.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break

            case "account_removed":
                humanizedEffectType = (
                    <div>
                        <div>
                            <div className="flex-row">
                                <div>
                                    <i className="material-icons">{icon}</i>
                                    <span>Acccount Removed </span>
                                    <span className="account-direction">
                                        {
                                            effect.account ===
                                                this.props.appAuth.publicKey ?
                                                "Yours" :
                                                "Theirs"
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="payment-details-body">
                            <div>
                                <span className="payment-details-account">
                                    {pubKeyAbbr(effect.account)}
                                </span>
                                <div className="payment-details-fieldset">
                                    <div className="payment-details-memo">
                                        <span className="smaller">
                                            Account Closed:
                                            {" "}
                                            {pubKeyAbbr(effect.account)}
                                        </span>
                                    </div>
                                    <div className="payment-details-id">
                                        ID: {effect.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break

            case "account_credited":
                humanizedEffectType = (
                    <div>
                        <div className="flex-row">
                            <div>
                                <i className="material-icons">{icon}</i>
                                <span>Acccount Credited </span>
                                <span className="account-direction">
                                    {effect.account ===
                                    this.props.appAuth.publicKey
                                        ? "Yours"
                                        : "Theirs"}
                                </span>
                            </div>
                            <div>
                                <div className="f-e-col">
                                    <div>
                                        {getAssetCode(effect) === "XLM" ? (
                                            <span className="credit">
                                                {" "}&#x0002B;{" "}
                                                {this.getCurrencyGlyph(
                                                    this.props.accountInfo.currency
                                                )}{" "}
                                                {this.convertToFiat(
                                                    effect.amount
                                                )}
                                            </span>
                                        ) : (
                                            <span className="credit">
                                                {" "}&#x0002B;{" "}
                                                {effect.amount}{" "}
                                                <span className="smaller">
                                                    {getAssetCode(effect)}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="fade-extreme">
                                        <span className="micro-font">
                                            {effect.amount}
                                        </span>{" "}
                                        <span className="pico-font small-caps">
                                            XLM
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="payment-details-body">
                            <div>
                                <span className="payment-details-account">
                                    {pubKeyAbbr(effect.account)}
                                </span>
                                <div className="payment-details-fieldset">
                                    <div className="payment-details-memo">
                                        <span className="smaller">Memo:</span>
                                        {" "}
                                        {this.state.paymentDetails.memo}
                                    </div>
                                    <div className="payment-details-id">
                                        ID: {effect.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break

            case "account_debited":
                humanizedEffectType = (
                    <div>
                        <div className="flex-row">
                            <div>
                                <i className="material-icons">{icon}</i>
                                <span>Acccount Debited </span>
                                <span className="account-direction">
                                    {effect.account ===
                                    this.props.appAuth.publicKey
                                        ? "Yours"
                                        : "Theirs"}
                                </span>
                            </div>
                            <div>
                                <div className="f-e-col">
                                    <div>
                                        {getAssetCode(effect) === "XLM" ? (
                                            <span className="debit">
                                                {" "}&#x02212;{" "}
                                                {this.getCurrencyGlyph(
                                                    this.props.accountInfo.currency
                                                )}{" "}
                                                {this.convertToFiat(
                                                    effect.amount
                                                )}
                                            </span>
                                        ) : (
                                            <span className="debit">
                                                {" "}&#x02212;{" "}
                                                {effect.amount}{" "}
                                                <span className="smaller">
                                                    {getAssetCode(effect)}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="fade-extreme">
                                        <span className="micro-font">
                                            {effect.amount}
                                        </span>
                                        {" "}
                                        <span className="pico-font small-caps">
                                            XLM
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="payment-details-body">
                            <div>
                                <span className="payment-details-account">
                                    {pubKeyAbbr(effect.account)}
                                </span>
                                <div className="payment-details-fieldset">
                                    <div className="payment-details-memo">
                                        <span className="smaller">Memo:</span>
                                        {" "}
                                        {this.state.paymentDetails.memo}
                                    </div>
                                    <div className="payment-details-id">
                                        ID: {effect.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break

            case "signer_created":
                humanizedEffectType = (
                    <div>
                        <div className="flex-row">
                            <div>
                                <i className="material-icons">{icon}</i>
                                <span>Signer Created {emoji.pencil}</span>
                                {" "}
                                <span className="account-direction">
                                    {effect.public_key ===
                                    this.props.appAuth.publicKey
                                        ? "You"
                                        : "They"}
                                </span>
                            </div>
                            <div />
                        </div>
                        <div className="payment-details-body">
                            <div>
                                <span className="payment-details-account">
                                    {pubKeyAbbr(effect.account)}
                                </span>
                                <div className="payment-details-fieldset">
                                    <div className="payment-details-id">
                                        ID: {effect.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break

            default:
                humanizedEffectType = effect.type
                break
        }

        return humanizedEffectType
    }


    // ...
    updateCursors = (records) =>
        this.setState({
            cursorLeft: records[0].paging_token,
            cursorRight: records[records.length - 1].paging_token,
        })


    // ...
    updateTransactionsCursors = (records) =>
        this.setState({
            txCursorLeft: records[0].paging_token,
            txCursorRight: records[records.length - 1].paging_token,
        })


    // ...
    getNextPaymentsPage = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)

        server
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("desc")
            .cursor(this.state.cursorRight)
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises = paymentsResult.records.map((r) => {
                    let link = ""
                    switch (r.type) {
                        case "create_account":
                            if (r.funder === this.props.appAuth.publicKey) {
                                link = gravatarLink(r.account)
                            } else {
                                link = gravatarLink(r.funder)
                            }
                            break

                        // payment
                        default:
                            if (r.to === this.props.appAuth.publicKey) {
                                link = gravatarLink(r.from)
                            } else {
                                link = gravatarLink(r.to)
                            }
                            break
                    }
                    return link
                })

                Promise.all(gravatarLinkPromises).then((links) => {
                    links.forEach((link, index) => {
                        paymentsResult.records[index].gravatar = link.link
                        paymentsResult.records[index].firstName = link.firstName
                        paymentsResult.records[index].lastName = link.lastName
                        paymentsResult.records[index].email = link.email
                        paymentsResult.records[index].alias = link.alias
                        paymentsResult.records[index].domain = link.domain
                    })
                    if (paymentsResult.records.length > 0) {
                        this.setState({
                            prevDisabled: false,
                        })
                        this.props.setAccountPayments(paymentsResult)
                        this.updateCursors(paymentsResult.records)
                    } else {
                        this.noMorePaymentsNotice.call(this, { nextDisabled: true, })
                    }
                })
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })
    }


    // ...
    getPrevPaymentsPage = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)

        server
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("asc")
            .cursor(this.state.cursorLeft)
            .limit(5)
            .call()
            .then((paymentsResult) => {

                const gravatarLinkPromises = paymentsResult.records.map((r) => {
                    let link = ""
                    switch (r.type) {
                        case "create_account":
                            if (r.funder === this.props.appAuth.publicKey) {
                                link = gravatarLink(r.account)
                            } else {
                                link = gravatarLink(r.funder)
                            }
                            break

                        // payment
                        default:
                            if (r.to === this.props.appAuth.publicKey) {
                                link = gravatarLink(r.from)
                            } else {
                                link = gravatarLink(r.to)
                            }
                            break
                    }
                    return link
                })

                Promise.all(gravatarLinkPromises).then((links) => {

                    links.forEach((link, index) => {
                        paymentsResult.records[index].gravatar = link.link
                        paymentsResult.records[index].firstName = link.firstName
                        paymentsResult.records[index].lastName = link.lastName
                        paymentsResult.records[index].email = link.email
                        paymentsResult.records[index].alias = link.alias
                        paymentsResult.records[index].domain = link.domain
                    })
                    if (paymentsResult.records.length > 0) {
                        this.setState({
                            nextDisabled: false,
                        })
                        paymentsResult.records.reverse()
                        this.props.setAccountPayments(paymentsResult)
                        this.updateCursors(paymentsResult.records)
                    } else {
                        this.noMorePaymentsNotice.call(
                            this, { prevDisabled: true, }
                        )
                    }
                })
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })
    }


    // ...
    getNextTransactionsPage = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)

        server
            .transactions()
            .forAccount(this.props.appAuth.publicKey)
            .order("desc")
            .cursor(this.state.txCursorRight)
            .limit(5)
            .call()
            .then((transactionsResult) => {
                if (transactionsResult.records.length > 0) {
                    this.setState({
                        txPrevDisabled: false,
                    })
                    this.props.setAccountTransactions(transactionsResult)
                    this.updateTransactionsCursors(transactionsResult.records)
                } else {
                    this.noMoreTransactionsNotice.call(this, {
                        txNextDisabled: true,
                    })
                }
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })
    }


    // ...
    getPrevTransactionsPage = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)

        server
            .transactions()
            .forAccount(this.props.appAuth.publicKey)
            .order("asc")
            .cursor(this.state.txCursorLeft)
            .limit(5)
            .call()
            .then((transactionsResult) => {
                if (transactionsResult.records.length > 0) {
                    this.setState({
                        txNextDisabled: false,
                    })
                    transactionsResult.records.reverse()
                    this.props.setAccountTransactions(transactionsResult)
                    this.updateTransactionsCursors(transactionsResult.records)
                } else {
                    this.noMoreTransactionsNotice.call(this, {
                        txPrevDisabled: true,
                    })
                }
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })
    }


    // ...
    determineLeftIcon = (payment) => {
        let rendered = ""

        switch (payment.type) {
            case "create_account":
                rendered =
                    payment.funder === this.props.appAuth.publicKey ? (
                        <i className={
                            this.context.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>card_giftcard</i>
                    ) : (
                        <i className={
                            this.context.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>account_balance</i>
                    )
                break

            case "account_merge":
                rendered =
                    <i className={
                        this.context.loginManager.isAuthenticated() ?
                            ("material-icons badge") :
                            ("material-icons")
                    }>merge_type</i>
                break

            default:
                rendered =
                    payment.to === this.props.appAuth.publicKey ? (
                        <i className={
                            this.context.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>account_balance_wallet</i>
                    ) : (
                        <i className={
                            this.context.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>payment</i>
                    )
                break
        }

        return rendered
    }


    // ...
    determinePrimaryText = (payment) => {
        let rendered = ""

        switch (payment.type) {
            case "create_account":
                rendered =
                    payment.funder === this.props.appAuth.publicKey ?
                        <span>
                            &#x02212;
                            {" "}
                            {this.getCurrencyGlyph(this.props.accountInfo.currency)}
                            {" "}
                            {this.convertToFiat(payment.starting_balance)}
                        </span> :
                        <span>
                            &#x0002B;
                            {" "}
                            {this.getCurrencyGlyph(this.props.accountInfo.currency)}
                            {" "}
                            {this.convertToFiat(payment.starting_balance)}
                        </span>
                break

            case "account_merge":
                rendered = "Account Merged"
                break

            default:
                if (getAssetCode(payment) === "XLM") {
                    rendered =
                        payment.to === this.props.appAuth.publicKey ?
                            <span>
                                &#x0002B;
                                {" "}
                                {this.getCurrencyGlyph(this.props.accountInfo.currency)}
                                {" "}
                                {this.convertToFiat(payment.amount)}
                            </span> :
                            <span>
                                &#x02212;
                                {" "}
                                {this.getCurrencyGlyph(this.props.accountInfo.currency)}
                                {" "}
                                {this.convertToFiat(payment.amount)}
                            </span>
                } else {
                    rendered =
                        payment.to === this.props.appAuth.publicKey ?
                            <span>
                                &#x0002B;
                                {" "}
                                {payment.amount}
                                {" "}
                                {getAssetCode(payment)}
                            </span> :
                            <span>
                                &#x02212;
                                {" "}
                                {payment.amount}
                                {" "}
                                {getAssetCode(payment)}
                            </span>
                }
                break
        }

        return rendered
    }


    // ...
    convertToXLM = (amount) => {
        BigNumber.config({ DECIMAL_PLACES: 7, ROUNDING_MODE: 4, })
        const fiatAmount = new BigNumber(amount)

        if (
            this.props.accountInfo.rates  &&
            this.props.accountInfo.rates[this.props.accountInfo.currency]
        ) {
            return fiatAmount.dividedBy(
                this.props.accountInfo.rates[
                    this.props.accountInfo.currency
                ].rate
            ).toString()
        }

        return "0"
    }


    // ...
    convertToFiat = (amount) => {
        BigNumber.config({ DECIMAL_PLACES: 2, })
        const nativeAmount = new BigNumber(amount)

        if (
            this.props.accountInfo.rates  &&
            this.props.accountInfo.rates[this.props.accountInfo.currency]
        ) {
            return nativeAmount.multipliedBy(
                this.props.accountInfo.rates[
                    this.props.accountInfo.currency
                ].rate
            ).toFixed(2)
        }

        return "0"
    }


    // ...
    getCurrencyGlyph = (currency) => (
        (c) => c[Object.keys(c).filter((key) => key === currency)]
    )({
        eur: "€",
        usd: "$",
        aud: "$",
        nzd: "$",
        thb: "฿",
        pln: "zł",
    })


    // ...
    render = () =>
        <div>
            <SnackBar
                open={this.state.sbPayment}
                message={`${this.state.sbPaymentText} ${
                    this.state.sbPaymentAmount
                } ${this.state.sbPaymentAssetCode}`}
                onRequestClose={
                    this.handlePaymentSnackBarClose.bind(this)
                }
            />
            <SnackBar
                open={this.state.sbNoMorePayments}
                message="No more payments found."
                onRequestClose={
                    this.handleNoMorePaymentsSnackBarClose.bind(this)
                }
            />
            <SnackBar
                open={this.state.sbNoMoreTransactions}
                message="No more transactions found."
                onRequestClose={
                    this.handleNoMoreTransactionsSnackBarClose.bind(this)
                }
            />
            <Tabs
                tabItemContainerStyle={styles.container}
                inkBarStyle={styles.inkBar}
                value={this.props.ui.tabs.payments}
                onChange={this.handleTabSelect.bind(this, this.value)}
            >
                <Tab style={styles.tab} label="History" value="1">
                    <div className="tab-content">
                        <div className="account-title">
                            Payment History
                        </div>
                        <div className="account-subtitle">
                            Newest payments shown as first.
                        </div>
                        <div className="flex-row-space-between">
                            <div className="flex-row-column">
                                <div>
                                    {this.props.accountInfo.payments ? (
                                        <div>
                                            <SelectableList
                                                defaultValue={1}
                                            >
                                                {this.props.accountInfo.payments.records.map(
                                                    (
                                                        payment,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                payment.id
                                                            }
                                                            className={
                                                                this
                                                                    .state
                                                                    .paymentDetails
                                                                    .selectedPaymentId ===
                                                                payment.id
                                                                    ? "payment-item-active"
                                                                    : "payment-item"
                                                            }
                                                        >
                                                            <ListItem
                                                                value={
                                                                    index +
                                                                    1
                                                                }
                                                                onClick={this.handlePaymentClick.bind(
                                                                    this,
                                                                    payment,
                                                                    payment.id
                                                                )}
                                                                leftIcon={this.determineLeftIcon.call(
                                                                    this,
                                                                    payment
                                                                )}
                                                                hoverColor="rgba(244,176,4,0.95)"
                                                                secondaryText={
                                                                    <Fragment>
                                                                        <div className="tiny fade-strong">
                                                                            {utcToLocaleDateTime(
                                                                                payment.created_at
                                                                            )}
                                                                        </div>
                                                                        {this.context.loginManager.isAuthenticated() ?
                                                                            (<div className="small fade">
                                                                                {payment.firstName ? payment.firstName : "Unknown"} {payment.lastName ? payment.lastName : "Payee"}
                                                                                {(payment.alias && payment.domain) ?
                                                                                    (<span className="p-l-small micro">[{payment.alias}*{payment.domain}]</span>) :
                                                                                    (<span className="p-l-small micro">&#x0205F;</span>)}
                                                                            </div>) : null}
                                                                    </Fragment>
                                                                }
                                                                primaryText={this.determinePrimaryText.call(
                                                                    this,
                                                                    payment
                                                                )}
                                                                rightAvatar={
                                                                    this.context.loginManager.isAuthenticated() ? (
                                                                        <Avatar
                                                                            className="square-avatar"
                                                                            backgroundColor="rgba(244,176,4,1)"
                                                                            size={
                                                                                70
                                                                            }
                                                                            src={payment.gravatar}
                                                                        />) : null
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </SelectableList>
                                        </div>
                                    ) : null}
                                    <div>
                                        <div className="flex-row-space-between p-t">
                                            <IconButton
                                                className="paging-icon"
                                                tooltip="Previous Payments"
                                                tooltipStyles={
                                                    styles.tooltip
                                                }
                                                tooltipPosition="top-right"
                                                onClick={
                                                    this.getPrevPaymentsPage.bind(this)
                                                }
                                                disabled={
                                                    this.state
                                                        .prevDisabled
                                                }
                                            >
                                                <i className="material-icons">
                                                    fast_rewind
                                                </i>
                                            </IconButton>

                                            <IconButton
                                                className="paging-icon"
                                                tooltip="Next Payments"
                                                tooltipStyles={
                                                    styles.tooltip
                                                }
                                                tooltipPosition="top-left"
                                                onClick={
                                                    this.getNextPaymentsPage.bind(this)
                                                }
                                                disabled={
                                                    this.state
                                                        .nextDisabled
                                                }
                                            >
                                                <i className="material-icons">
                                                    fast_forward
                                                </i>
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-row-column">
                                <div>
                                    <div className="transaction-details-header">
                                        <div className="flex-row">
                                            <div>
                                                Payment ID:{" "}
                                                {
                                                    this.state
                                                        .paymentDetails
                                                        .txid
                                                }
                                            </div>
                                            <div>
                                                {utcToLocaleDateTime(
                                                    this.state
                                                        .paymentDetails
                                                        .created_at
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="transaction-details-body">
                                        {this.state.paymentDetails.effects.map(
                                            (effect, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="payment-details-item"
                                                    >
                                                        <span className="effect-title">
                                                            {this.decodeEffectType(
                                                                effect,
                                                                index
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                <Tab style={styles.tab} label="Transactions" value="2">
                    <div className="tab-content">
                        <div className="flex-row">
                            <div>
                                <div className="account-title">
                                    Account Transactions
                                </div>
                                <div className="account-subtitle">
                                    Newest transactions shown as first.
                                </div>
                                <div className="p-t" />
                                {this.props.accountInfo.transactions ? (
                                    <Table style={styles.table}>
                                        <TableHeader
                                            className="tx-table-header"
                                            displaySelectAll={false}
                                            adjustForCheckbox={false}
                                        >
                                            <TableRow
                                                className="tx-table-row"
                                                style={styles.tableRow}
                                            >
                                                <TableHeaderColumn className="tx-table-header-column">
                                                    Transaction Time
                                                </TableHeaderColumn>
                                                <TableHeaderColumn className="tx-table-header-column">
                                                    Account
                                                </TableHeaderColumn>
                                                <TableHeaderColumn className="tx-table-header-column">
                                                    Memo
                                                </TableHeaderColumn>
                                                <TableHeaderColumn className="tx-table-header-column">
                                                    Fee Paid
                                                </TableHeaderColumn>
                                                <TableHeaderColumn className="tx-table-header-column">
                                                    Signature Count
                                                </TableHeaderColumn>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody
                                            displayRowCheckbox={false}
                                        >
                                            {this.props.accountInfo.transactions.records.map(
                                                (tx, index) => (
                                                    <TableRow
                                                        selectable={
                                                            false
                                                        }
                                                        key={index}
                                                        className="tx-table-row"
                                                    >
                                                        <TableRowColumn className="tx-table-row-column">
                                                            {utcToLocaleDateTime(
                                                                tx.created_at
                                                            )}
                                                        </TableRowColumn>
                                                        <TableRowColumn className="tx-table-row-column">
                                                            <span>
                                                                <span>
                                                                    {pubKeyAbbr(
                                                                        tx.source_account
                                                                    )}
                                                                </span>
                                                                <span className="account-direction">
                                                                    {tx.source_account ===
                                                                    this
                                                                        .props
                                                                        .accountInfo
                                                                        .pubKey
                                                                        ? "Yours"
                                                                        : "Theirs"}
                                                                </span>
                                                            </span>
                                                        </TableRowColumn>
                                                        <TableRowColumn className="tx-table-row-column">
                                                            {tx.memo}
                                                        </TableRowColumn>
                                                        <TableRowColumn className="tx-table-row-column">
                                                            {
                                                                tx.fee_paid
                                                            }
                                                        </TableRowColumn>
                                                        <TableRowColumn className="tx-table-row-column">
                                                            {
                                                                tx
                                                                    .signatures
                                                                    .length
                                                            }
                                                        </TableRowColumn>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                ) : null}
                                <div className="p-b" />
                                <div className="flex-row-space-between p-t">
                                    <IconButton
                                        className="paging-icon"
                                        tooltip="Previous Transactions"
                                        tooltipStyles={styles.tooltip}
                                        tooltipPosition="top-right"
                                        onClick={this.getPrevTransactionsPage.bind(
                                            this
                                        )}
                                        disabled={
                                            this.state.txPrevDisabled
                                        }
                                    >
                                        <i className="material-icons">
                                            fast_rewind
                                        </i>
                                    </IconButton>

                                    <IconButton
                                        className="paging-icon"
                                        tooltip="Next Transactions"
                                        tooltipStyles={styles.tooltip}
                                        tooltipPosition="top-left"
                                        onClick={this.getNextTransactionsPage.bind(
                                            this
                                        )}
                                        disabled={
                                            this.state.txNextDisabled
                                        }
                                    >
                                        <i className="material-icons">
                                            fast_forward
                                        </i>
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
        loadingModal: state.loadingModal,
        ui: state.ui,
        isAuthenticated: state.auth.isAuthenticated,
        appAuth: state.appAuth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setAccountPayments,
        setAccountTransactions,
        setStreamer,
        accountExistsOnLedger,
        accountMissingOnLedger,
        setTab,
        setModalLoading,
        setModalLoaded,
        updateLoadingMessage,
    }, dispatch)
)(Payments)
