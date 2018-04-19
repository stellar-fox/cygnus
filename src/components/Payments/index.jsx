import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    ensureTrailingSlash,
    resolvePath,
    withDynamicRoutes,
    withStaticRouter,
} from "../StellarRouter"

import {
    emoji,
    htmlEntities as he,
    pubKeyAbbr,
} from "../../lib/utils"
import { gravatarLink } from "../../lib/deneb"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"

import {
    setAccountPayments,
    setAccountTransactions,
    setStreamer,
    accountExistsOnLedger,
    accountMissingOnLedger,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    changeSnackbarState,
} from "../../redux/actions"
import { action as PaymentsAction } from "../../redux/Payments"

import {
    Tab,
    Tabs,
} from "material-ui/Tabs"
import PaymentsHistory from "./PaymentsHistory"
import Transactions from "./Transactions"
import { config } from "../../config"
import { StellarSdk, loadAccount } from "../../lib/stellar-tx"

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
    static propTypes = {
        match: PropTypes.object.isRequired,
        staticRouter: PropTypes.object.isRequired,
    }


    // ...
    constructor (props) {
        super(props)

        // relative resolve
        this.rr = resolvePath(this.props.match.path)

        // ...
        this.validTabNames = ["History", "Transactions", ]

        // static paths
        this.props.staticRouter.addPaths(
            this.validTabNames.reduce((acc, tn) => ({
                ...acc,
                [tn]: this.rr(ensureTrailingSlash(tn.toLowerCase())),
            }), {})
        )

        // ...
        this.stellarServer = new StellarSdk.Server(config.horizon)
    }


    // ...
    componentDidMount = () => {
        this.props.setModalLoading()
        this.props.updateLoadingMessage({
            message: "Loading payments data ...",
        })
        this.props.setStreamer(this.paymentsStreamer.call(this))

        this.stellarServer
            .payments()
            .forAccount(this.props.publicKey)
            .order("desc")
            .limit(5)
            .call()
            .then((paymentsResult) => {
                const gravatarLinkPromises =
                    paymentsResult.records.map((r) => {
                        let link = "https://www.gravatar.com/avatar?d=mm&s=100"
                        if (this.props.loginManager.isAuthenticated()) {
                            switch (r.type) {
                                case "create_account":
                                    if (
                                        r.funder === this.props.publicKey
                                    ) {
                                        link = gravatarLink(r.account)
                                    } else {
                                        link = gravatarLink(r.funder)
                                    }
                                    break

                                // payment
                                default:
                                    if(r.to === this.props.publicKey) {
                                        link = gravatarLink(r.from)
                                    } else {
                                        link = gravatarLink(r.to)
                                    }
                                    break
                            }
                        }
                        return link
                    })

                Promise.all(gravatarLinkPromises).then((links) => {
                    links.forEach((link, index) => {
                        paymentsResult.records[index]
                            .gravatar = link.link
                        paymentsResult.records[index]
                            .firstName = link.firstName
                        paymentsResult.records[index]
                            .lastName = link.lastName
                        paymentsResult.records[index]
                            .email = link.email
                        paymentsResult.records[index]
                            .alias = link.alias
                        paymentsResult.records[index]
                            .domain = link.domain
                    })
                    this.props.setAccountPayments(paymentsResult)
                    this.updateCursors(paymentsResult.records)
                    paymentsResult.records[0].effects().then((effects) => {
                        paymentsResult.records[0].transaction().then((tx) => {
                            this.props.setState({
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
    componentWillUnmount = () =>
        this.props.accountInfo.streamer.call(this)


    // ...
    getTransactions = () => {
        if (
            (this.props.state.txCursorLeft === null  &&
            this.props.state.txCursorRight === null)  ||
            !this.props.accountInfo.transactions
        ) {
            return this.stellarServer
                .transactions()
                .forAccount(this.props.publicKey)
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
        return Promise.resolve()
    }


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
                        message.source_account === this.props.publicKey
                    ) {
                        this.updateAccount.call(this)

                        this.props.changeSnackbarState({
                            open: true,
                            message: `Payment sent to new account [${
                                pubKeyAbbr(message.acount)}]: ${
                                this.props.assetManager.convertToAsset(
                                    message.starting_balance)} ${
                                this.props.Account.currency.toUpperCase()}`,
                        })

                    }


                    /*
                     * Initial funding of own account.
                     */
                    if (
                        message.type === "create_account" &&
                        message.account === this.props.publicKey
                    ) {
                        this.updateAccount.call(this)

                        this.props.changeSnackbarState({
                            open: true,
                            message: `Account Funded: ${
                                this.props.assetManager.convertToAsset(
                                    message.starting_balance)} ${
                                this.props.Account.currency.toUpperCase()}`,
                        })

                    }

                    /*
                     * Receiving payment.
                     */
                    if (
                        message.type === "payment" &&
                        message.to === this.props.publicKey
                    ) {
                        this.updateAccount.call(this)

                        this.props.changeSnackbarState({
                            open: true,
                            message: `Payment Received: ${
                                this.props.assetManager.convertToAsset(
                                    message.amount)} ${
                                this.props.Account.currency.toUpperCase()}`,
                        })

                    }

                    /*
                     * Sending payment.
                     */
                    if (
                        message.type === "payment" &&
                        message.from === this.props.publicKey
                    ) {
                        this.updateAccount.call(this)

                        this.props.changeSnackbarState({
                            open: true,
                            message: `Payment Sent: ${
                                this.props.assetManager.convertToAsset(
                                    message.amount)} ${
                                this.props.Account.currency.toUpperCase()}`,
                        })

                    }
                },
            })


    // ...
    updateAccount = () =>
        loadAccount(this.props.publicKey)
            .catch(StellarSdk.NotFoundError, function (_err) {
                throw new Error("The destination account does not exist!")
            })
            .then(
                (account) => {
                    this.props.accountExistsOnLedger({ account, })
                    this.stellarServer
                        .payments()
                        .limit(5)
                        .forAccount(this.props.publicKey)
                        .order("desc")
                        .call()
                        .then((paymentsResult) => {
                            const gravatarLinkPromises =
                                paymentsResult.records.map((r) => {
                                    let link = "https://www.gravatar.com/avatar?d=mm&s=100"
                                    if (this.props.loginManager.isAuthenticated()) {
                                        switch (r.type) {
                                            case "create_account":
                                                if (
                                                    r.funder ===
                                                        this.props.publicKey
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
                                                        this.props.publicKey
                                                ) {
                                                    link = gravatarLink(r.from)
                                                } else {
                                                    link = gravatarLink(r.to)
                                                }
                                                break
                                        }
                                    }
                                    return link
                                })

                            Promise.all(gravatarLinkPromises).then((links) => {
                                links.forEach((link, index) => {
                                    paymentsResult.records[index]
                                        .gravatar = link.link
                                    paymentsResult.records[index]
                                        .firstName = link.firstName
                                    paymentsResult.records[index]
                                        .lastName = link.lastName
                                    paymentsResult.records[index]
                                        .email = link.email
                                    paymentsResult.records[index]
                                        .alias = link.alias
                                    paymentsResult.records[index]
                                        .domain = link.domain
                                })
                                this.props.setAccountPayments(paymentsResult)
                                this.updateCursors(paymentsResult.records)
                                paymentsResult.records[0]
                                    .effects().then((effects) => {
                                        paymentsResult.records[0]
                                            .transaction().then((tx) => {
                                                this.props.setState({
                                                    paymentDetails: {
                                                        txid:
                                                            paymentsResult
                                                                .records[0].id,
                                                        created_at:
                                                            paymentsResult
                                                                .records[0]
                                                                .created_at,
                                                        effects:
                                                            effects
                                                                ._embedded
                                                                .records,
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
    handleTabSelect = (value) => {
        this.props.setState({ tabSelected: value, })
        this.props.staticRouter.pushByView(value)
        if (value === "Transactions") {
            this.getTransactions()
        }
    }


    // ...
    handlePaymentClick = (payment, paymentId) =>
        payment.effects().then((effects) =>
            payment.transaction().then((tx) =>
                this.props.setState({
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
    updateCursors = (records) =>
        this.props.setState({
            cursorLeft: records[0].paging_token,
            cursorRight: records[records.length - 1].paging_token,
        })


    // ...
    updateTransactionsCursors = (records) =>
        this.props.setState({
            txCursorLeft: records[0].paging_token,
            txCursorRight: records[records.length - 1].paging_token,
        })


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
                                    {
                                        effect.account ===
                                            this.props.publicKey ?
                                            "Yours" : "Theirs"
                                    }
                                </span>
                            </div>
                            <div className="f-e-col">
                                <div>
                                    <span className="credit">
                                        <he.Space /><he.Plus /><he.Space />
                                        {
                                            this.props.assetManager
                                                .getAssetGlyph(
                                                    this.props.Account
                                                        .currency
                                                )
                                        }
                                        <he.Space />
                                        {
                                            this.props
                                                .assetManager.convertToAsset(
                                                    effect.starting_balance
                                                )
                                        }
                                    </span>
                                </div>
                                <div className="fade-extreme">
                                    <span className="micro-font">
                                        {effect.starting_balance}
                                    </span><he.Space />
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
                                        <he.Space />
                                        {this.props.state.paymentDetails.memo}
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
                                                this.props.publicKey ?
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
                                            <he.Space />
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
                                    {
                                        effect.account ===
                                            this.props.publicKey ?
                                            "Yours" : "Theirs"
                                    }
                                </span>
                            </div>
                            <div>
                                <div className="f-e-col">
                                    <div>
                                        {
                                            this.props.assetManager
                                                .getAssetCode(effect) ===
                                                    "XLM" ?
                                                <span className="credit">
                                                    <he.Space />
                                                    <he.Plus />
                                                    <he.Space />
                                                    {
                                                        this.props.assetManager
                                                            .getAssetGlyph(
                                                                this.props
                                                                    .Account
                                                                    .currency
                                                            )
                                                    }<he.Space />
                                                    {
                                                        this.props
                                                            .assetManager
                                                            .convertToAsset(
                                                                effect.amount
                                                            )
                                                    }
                                                </span> :
                                                <span className="credit">
                                                    <he.Space />
                                                    <he.Plus />
                                                    <he.Space />
                                                    {effect.amount}<he.Space />
                                                    <span className="smaller">
                                                        {
                                                            this.props
                                                                .assetManager
                                                                .getAssetCode(
                                                                    effect
                                                                )
                                                        }
                                                    </span>
                                                </span>
                                        }
                                    </div>
                                    <div className="fade-extreme">
                                        <span className="micro-font">
                                            {effect.amount}
                                        </span><he.Space />
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
                                        <he.Space />
                                        {this.props.state.paymentDetails.memo}
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
                                    this.props.publicKey
                                        ? "Yours"
                                        : "Theirs"}
                                </span>
                            </div>
                            <div>
                                <div className="f-e-col">
                                    <div>
                                        {
                                            this.props.assetManager
                                                .getAssetCode(effect) ===
                                                "XLM" ?
                                                <span className="debit">
                                                    <he.Space />
                                                    <he.Minus />
                                                    <he.Space />
                                                    {
                                                        this.props
                                                            .assetManager
                                                            .getAssetGlyph(
                                                                this.props
                                                                    .Account
                                                                    .currency
                                                            )
                                                    }<he.Space />
                                                    {
                                                        this.props
                                                            .assetManager
                                                            .convertToAsset(
                                                                effect.amount
                                                            )
                                                    }
                                                </span> :
                                                <span className="debit">
                                                    <he.Space />
                                                    <he.Minus />
                                                    <he.Space />
                                                    {effect.amount}
                                                    <he.Space />
                                                    <span className="smaller">
                                                        {
                                                            this.props
                                                                .assetManager
                                                                .getAssetCode(
                                                                    effect
                                                                )
                                                        }
                                                    </span>
                                                </span>
                                        }
                                    </div>
                                    <div className="fade-extreme">
                                        <span className="micro-font">
                                            {effect.amount}
                                        </span>
                                        <he.Space />
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
                                        <he.Space />
                                        {this.props.state.paymentDetails.memo}
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
                                <span>Signer Created <emoji.Pencil /></span>
                                <he.Space />
                                <span className="account-direction">
                                    {effect.public_key ===
                                    this.props.publicKey
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
    render = () => (
        ({ currentView, staticRouter: { getPath, }, state, }) =>
            <Switch>
                <Redirect exact
                    from={this.rr(".")}
                    to={getPath(state.tabSelected)}
                />
                <Route exact path={getPath(state.tabSelected)}>
                    <Tabs
                        tabItemContainerStyle={styles.container}
                        inkBarStyle={styles.inkBar}
                        value={
                            this.validTabNames.indexOf(currentView) !== -1 ?
                                currentView : state.tabSelected
                        }
                        onChange={this.handleTabSelect}
                    >
                        <Tab
                            style={styles.tab}
                            label={this.validTabNames[0]}
                            value={this.validTabNames[0]}
                        >
                            <div className="tab-content">
                                <PaymentsHistory
                                    stellarServer={this.stellarServer}
                                    handlePaymentClick={
                                        this.handlePaymentClick
                                    }
                                    decodeEffectType={this.decodeEffectType}
                                    updateCursors={this.updateCursors}
                                />
                            </div>
                        </Tab>
                        <Tab
                            style={styles.tab}
                            label={this.validTabNames[1]}
                            value={this.validTabNames[1]}
                        >
                            <div className="tab-content">
                                <Transactions
                                    stellarServer={this.stellarServer}
                                    updateTransactionsCursors={
                                        this.updateTransactionsCursors
                                    }
                                    getTransactions={this.getTransactions}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </Route>
                <Redirect to={getPath(state.tabSelected)} />
            </Switch>
    )(this.props)

}


// ...
export default compose(
    withAssetManager,
    withLoginManager,
    withStaticRouter,
    withDynamicRoutes,
    connect(
        // map state to props.
        (state) => ({
            state: state.Payments,
            Account: state.Account,
            accountInfo: state.accountInfo,
            loadingModal: state.loadingModal,
            ui: state.ui,
            publicKey: state.LedgerHQ.publicKey,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: PaymentsAction.setState,
            setAccountPayments,
            setAccountTransactions,
            setStreamer,
            accountExistsOnLedger,
            accountMissingOnLedger,
            setModalLoading,
            setModalLoaded,
            updateLoadingMessage,
            changeSnackbarState,
        }, dispatch)
    ),
)(Payments)
