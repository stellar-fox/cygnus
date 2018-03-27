import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import BigNumber from "bignumber.js"

import {
    pubKeyAbbr,
    getAssetCode,
    formatAmount,
    StellarSdk,
} from "../../lib/utils"
import { emoji } from "../StellarFox/env"
import {
    gravatarLink,
} from "../../lib/deneb"
import { withLoginManager } from "../LoginManager"

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
} from "../../redux/actions"

import {
    Tabs,
    Tab,
} from "material-ui/Tabs"
import PaymentsHistory from "./PaymentsHistory"
import Transactions from "./Transactions"
import Snackbar from "../../lib/common/Snackbar"

import "./index.css"




// ...
const styles = {
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
}




// <Payments> component
class Payments extends Component {

    // ...
    state = {
        cursorLeft: null,
        cursorRight: null,
        prevDisabled: false,
        nextDisabled: false,
        paymentDetails: {
            txid: null,
            created_at: null,
            memo: "",
            effects: [],
            selectedPaymentId: null,
        },

        txCursorLeft: null,
        txCursorRight: null,
        txNextDisabled: false,
        txPrevDisabled: false,

        tabSelected: "1",
        sbPayment: false,
        sbPaymentAmount: null,
        sbPaymentAssetCode: null,
        sbNoMorePayments: false,
        sbNoMoreTransactions: false,
    }


    // ...
    stellarServer = new StellarSdk.Server(this.props.accountInfo.horizon)


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

        this.stellarServer
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
    handleNoMorePaymentsSnackbarClose = () =>
        this.setState({ sbNoMorePayments: false, })


    // ...
    handleNoMoreTransactionsSnackbarClose = () =>
        this.setState({ sbNoMoreTransactions: false, })


    // ...
    paymentsStreamer = () =>
        this.stellarServer
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


    // ...
    updateAccount = () =>
        this.stellarServer
            .loadAccount(this.props.appAuth.publicKey)
            .catch(StellarSdk.NotFoundError, function (_err) {
                throw new Error("The destination account does not exist!")
            })
            .then(
                (account) => {
                    this.props.accountExistsOnLedger({ account, })
                    this.stellarServer
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


    // ...
    handlePaymentSnackbarClose = () =>
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
            this.stellarServer
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
                                                    this.props
                                                        .accountInfo.currency
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
                                                    this.props
                                                        .accountInfo.currency
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
    getNextPaymentsPage = () =>
        this.stellarServer
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("desc")
            .cursor(this.state.cursorRight)
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises =
                    paymentsResult.records.map((r) => {
                        let link = ""
                        switch (r.type) {
                            case "create_account":
                                if (
                                    r.funder ===
                                        this.props.appAuth.publicKey
                                ) {
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
                        this.noMorePaymentsNotice.call(
                            this, { nextDisabled: true, }
                        )
                    }
                })
            })
            .catch(function (err) {
                // eslint-disable-next-line no-console
                console.log(err)
            })


    // ...
    getPrevPaymentsPage = () =>
        this.stellarServer
            .payments()
            .forAccount(this.props.appAuth.publicKey)
            .order("asc")
            .cursor(this.state.cursorLeft)
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises =
                    paymentsResult.records.map((r) => {
                        let link = ""
                        switch (r.type) {
                            case "create_account":
                                if (
                                    r.funder ===
                                        this.props.appAuth.publicKey
                                ) {
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


    // ...
    getNextTransactionsPage = () =>
        this.stellarServer
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


    // ...
    getPrevTransactionsPage = () =>
        this.stellarServer
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


    // ...
    determineLeftIcon = (payment) => {
        let rendered = ""

        switch (payment.type) {
            case "create_account":
                rendered =
                    payment.funder === this.props.appAuth.publicKey ?
                        <i className={
                            this.props.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>card_giftcard</i> :
                        <i className={
                            this.props.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>account_balance</i>
                break

            case "account_merge":
                rendered =
                    <i className={
                        this.props.loginManager.isAuthenticated() ?
                            ("material-icons badge") :
                            ("material-icons")
                    }>merge_type</i>
                break

            default:
                rendered =
                    payment.to === this.props.appAuth.publicKey ?
                        <i className={
                            this.props.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>account_balance_wallet</i> :
                        <i className={
                            this.props.loginManager.isAuthenticated() ?
                                ("material-icons badge") :
                                ("material-icons")
                        }>payment</i>
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
                            {this.getCurrencyGlyph(
                                this.props.accountInfo.currency
                            )}
                            {" "}
                            {this.convertToFiat(payment.starting_balance)}
                        </span> :
                        <span>
                            &#x0002B;
                            {" "}
                            {this.getCurrencyGlyph(
                                this.props.accountInfo.currency
                            )}
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
                                {this.getCurrencyGlyph(
                                    this.props.accountInfo.currency
                                )}
                                {" "}
                                {this.convertToFiat(payment.amount)}
                            </span> :
                            <span>
                                &#x02212;
                                {" "}
                                {this.getCurrencyGlyph(
                                    this.props.accountInfo.currency
                                )}
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
            <Snackbar
                open={this.state.sbPayment}
                message={`${this.state.sbPaymentText} ${
                    this.state.sbPaymentAmount
                } ${this.state.sbPaymentAssetCode}`}
                onRequestClose={
                    this.handlePaymentSnackbarClose
                }
            />
            <Snackbar
                open={this.state.sbNoMorePayments}
                message="No more payments found."
                onRequestClose={
                    this.handleNoMorePaymentsSnackbarClose
                }
            />
            <Snackbar
                open={this.state.sbNoMoreTransactions}
                message="No more transactions found."
                onRequestClose={
                    this.handleNoMoreTransactionsSnackbarClose
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

                        <PaymentsHistory
                            paymentDetails={this.state.paymentDetails}
                            handlePaymentClick={this.handlePaymentClick}
                            determineLeftIcon={this.determineLeftIcon}
                            determinePrimaryText={this.determinePrimaryText}
                            getPrevPaymentsPage={this.getPrevPaymentsPage}
                            getNextPaymentsPage={this.getNextPaymentsPage}
                            nextDisabled={this.state.nextDisabled}
                            prevDisabled={this.state.prevDisabled}
                            decodeEffectType={this.decodeEffectType}
                        />

                    </div>
                </Tab>

                <Tab style={styles.tab} label="Transactions" value="2">
                    <div className="tab-content">

                        <Transactions
                            getPrevTransactionsPage={this.getPrevTransactionsPage}
                            getNextTransactionsPage={this.getNextTransactionsPage}
                            txNextDisabled={this.state.txNextDisabled}
                            txPrevDisabled={this.state.txPrevDisabled}
                        />

                    </div>
                </Tab>

            </Tabs>
        </div>

}


// ...
export default withLoginManager(connect(
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
)(Payments))
