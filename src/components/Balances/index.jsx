import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import axios from "axios"
import "number-to-text/converters/en-us"
import { action as AccountAction } from "../../redux/Account"
import { signTransaction, awaitConnection } from "../../lib/ledger"
import {
    StellarSdk,
    pubKeyAbbr,
    handleException,
    insertPathIndex,
} from "../../lib/utils"
import {
    buildCreateAccountTx,
    buildPaymentTx,
    broadcastTx,
} from "../../lib/stellar-tx"
import { config } from "../../config"
import { appName } from "../StellarFox/env"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import {
    accountExistsOnLedger,
    accountMissingOnLedger,
    setAccountRegistered,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    changeLoginState,
    changeModalState,
    changeSnackbarState,
    ActionConstants,
    togglePaymentCard,
} from "../../redux/actions"
import { List, ListItem } from "material-ui/List"
import LinearProgress from "material-ui/LinearProgress"
import Button from "../../lib/common/Button"
import Snackbar from "../../lib/common/Snackbar"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"
import RegisterCard from "./RegisterCard"
import BalancesCard from "./BalancesCard"
import NoAccountCard from "./NoAccountCard"
import PaymentCard from "./PaymentCard"
import "./index.css"




// <Balances> component
class Balances extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }

    // ...
    state = {
        paymentsStreamer: null,
        sbPayment: false,
        sbPaymentAmount: null,
        sbPaymentAssetCode: null,
        modalButtonText: "CANCEL",
        amountEntered: false,
        payee: null,
        memoRequired: false,
        amountValid: false,
        amount: 0,
        transactionType: null,
        memoValid: false,
        buttonSendDisabled: true,
        paymentCardVisible: false,
        newAccount: false,
        paymentId: "",
        ledgerId: "",
    }


    // ...
    componentDidMount = () => {

        // FIXME: merge streamers
        this.setState({
            paymentsStreamer: this.paymentsStreamer.call(this),
            optionsStreamer: this.optionsStreamer.call(this),
        })

        this.props.changeSnackbarState({
            open: false,
            message: "",
        })

        if (!this.props.accountInfo.account) {
            this.props.setModalLoading()
            this.props.updateLoadingMessage({
                message: "Searching for account ...",
            })

            this._tmpQueryHorizon()
            this._tmpAccountExists()
        }
    }


    // ...
    componentWillUnmount = () => {
        this.state.paymentsStreamer.call(this)
        this.state.optionsStreamer.call(this)
    }


    // ...
    _tmpAccountExists = () => {
        axios.post(
            `${config.api}/user/ledgerauth/${
                this.props.appAuth.publicKey
            }/${
                this.props.appAuth.bip32Path
            }`
        ).then((_response) => {
            this.props.setAccountRegistered(true)
        }).catch((_error) => {
            // do nothing as this is only a check
        })
    }


    // ...
    _tmpQueryHorizon = () => {
        let server = new StellarSdk.Server(
            this.props.accountInfo.horizon
        )

        server
            .loadAccount(this.props.appAuth.publicKey)
            .then((account) => {
                this.props.accountExistsOnLedger({ account, })
                this.props.setState({ exists: true, })
            })
            .catch(StellarSdk.NotFoundError, () => {
                this.props.accountMissingOnLedger()
                this.props.setState({ exists: false, })
            })
            .finally(() => {
                setTimeout(() => {
                    this.props.setModalLoaded()
                }, 500)

            })
    }


    // ...
    optionsStreamer = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)

        return server.operations().cursor("now").stream({
            onmessage: (message) => {

                /*
                * Set options. (home_domain - experiment)
                */
                if (
                    message.type === "set_options"  &&
                    message.source_account ===
                        this.props.appAuth.publicKey  &&
                    this.props
                        .accountInfo.account
                        .account.home_domain !== message.home_domain

                ) {
                    this.updateAccount.call(this)
                    this.setState({
                        sbPayment: true,
                        sbPaymentText: "Home domain changed: ",
                        sbPaymentAmount:
                            message.home_domain ?
                                message.home_domain : "DOMAIN REMOVED",
                        sbPaymentAssetCode: "",
                    })
                }

            },
        })
    }


    // ...
    paymentsStreamer = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)
        return server.payments().cursor("now").stream({
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
                            this.props.assetManager.convertToAsset(
                                message.starting_balance),
                        sbPaymentAssetCode:
                            this.props.Account.currency.toUpperCase(),
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
                            this.props.assetManager.convertToAsset(
                                message.starting_balance),
                        sbPaymentAssetCode:
                            this.props.Account.currency.toUpperCase(),
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
                        sbPaymentText: "Balance Updated. Payment Received: ",
                        sbPaymentAmount: this.props.assetManager.convertToAsset(
                            message.amount),
                        sbPaymentAssetCode:
                            this.props.Account.currency.toUpperCase(),
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
                        sbPaymentText: "Balance Updated. Payment Sent: ",
                        sbPaymentAmount: this.props.assetManager.convertToAsset(
                            message.amount),
                        sbPaymentAssetCode:
                            this.props.Account.currency.toUpperCase(),
                    })
                }
            },
        })
    }


    // ...
    updateAccount = () => {
        let server = new StellarSdk.Server(this.props.accountInfo.horizon)
        server.loadAccount(this.props.appAuth.publicKey)
            .catch(StellarSdk.NotFoundError, (_) => {
                throw new Error("The destination account does not exist!")
            })
            .then((account) => {
                this.props.accountExistsOnLedger({account,})
            }, (_) => {
                this.props.accountMissingOnLedger()
            })
    }


    // ...
    handlePaymentSnackbarClose = () =>
        this.setState({
            sbPayment: false,
        })


    // ...
    hideSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: false,
            },
        })


    // ...
    buildSendTransaction = async () => {
        try {
            let tx = null
            const paymentData = {
                source: this.props.appAuth.publicKey,
                destination: this.props.Balances.payee,
                amount: this.props.assetManager.convertToNative(
                    this.props.Balances.amount),
                memo: this.props.Balances.memoText,
            }
            if (this.props.Balances.newAccount) {
                tx = await buildCreateAccountTx(paymentData)
            } else {
                tx = await buildPaymentTx(paymentData)
            }

            this.setState({
                transactionType: this.props.Balances.newAccount ?
                    "Create Account" : "Payment",
            })

            this.showNotice({
                title: "Confirm on Hardware Device",
                content: this.transactionFeedbackMessage(),
            })

            const signedTx = await signTransaction(
                insertPathIndex(this.props.appAuth.bip32Path),
                this.props.appAuth.publicKey,
                tx
            )

            this.showNotice({
                title: "Sending Money",
                content: this.broadcastTransactionMessage(),
            })

            const broadcast = await broadcastTx(signedTx)

            this.setState({ transactionType: null, })

            this.showNotice({
                title: "Completed",
                content: this.sendingCompleteMessage(),
            })

            this.setState({
                amountEntered: false,
                payee: null,
                memoRequired: false,
                amountValid: false,
                amount: 0,
                memoValid: false,
                buttonSendDisabled: true,
                paymentCardVisible: false,
                newAccount: false,
                paymentId: broadcast.hash,
                ledgerId: broadcast.ledger,
            })
            this.props.togglePaymentCard({
                payment: {
                    opened: false,
                },
            })
        } catch (error) {
            this.setState({
                transactionType: null,
                amountEntered: false,
                payee: null,
                memoRequired: false,
                amountValid: false,
                amount: 0,
                memoValid: false,
                buttonSendDisabled: true,
                paymentCardVisible: false,
                newAccount: false,
            })
            this.showError.call(this, error.message)
        }
    }


    // ...
    showError = (message) => {
        this.props.changeModalState({
            alertWithDismiss: {
                showing: true,
                title: "Error",
                content: message,
            },
        })
    }


    // ...
    showNotice = (content) => {
        this.props.changeModalState({
            alertWithDismiss: {
                showing: true,
                title: content.title,
                content: content.content,
            },
        })
    }


    // ...
    sendPayment = async () => {
        // check if device is connected first (if not deviceCheck is an error object)
        const deviceCheck = await awaitConnection()

        if (typeof deviceCheck === "string") {
            this.buildSendTransaction.call(this)
            return true
        } else {
            this.showError.call(this, deviceCheck.message)
            return false
        }
    }


    // ...
    transactionFeedbackMessage = () =>
        <Fragment>
            <div>
                Please confirm the following info on your device&apos;s screen.
            </div>
            <List>
                <ListItem
                    disabled={true}
                    primaryText="Type"
                    secondaryText={this.state.transactionType}
                    leftIcon={
                        <i className="green material-icons md-icon-small">
                            assignment_late
                        </i>
                    }
                />
                <ListItem
                    disabled={true}
                    primaryText="Amount"
                    secondaryText={
                        `${this.props.assetManager.convertToNative(this.props.Balances.amount)} XLM`
                    }
                    leftIcon={
                        <i className="green material-icons md-icon-small">
                            account_balance_wallet
                        </i>
                    }
                />
                <ListItem
                    disabled={true}
                    primaryText="Destination"
                    secondaryText={
                        handleException(
                            () => pubKeyAbbr(this.props.Balances.payee),
                            () => "Not Available"
                        )
                    }
                    leftIcon={
                        <i className="green material-icons md-icon-small">
                            local_post_office
                        </i>
                    }
                />
                <ListItem
                    disabled={true}
                    primaryText="Memo"
                    secondaryText={this.props.Balances.memoText}
                    leftIcon={
                        <i className="green material-icons md-icon-small">
                            speaker_notes
                        </i>
                    }
                />
                <ListItem
                    disabled={true}
                    primaryText="Fee"
                    secondaryText="0.000001 XLM"
                    leftIcon={
                        <i className="green material-icons md-icon-small">
                            credit_card
                        </i>
                    }
                />
                <ListItem
                    disabled={true}
                    primaryText="Network"
                    secondaryText="Test"
                    leftIcon={
                        <i className="green material-icons md-icon-small">
                            network_check
                        </i>
                    }
                />
            </List>
            <div>
                When you are sure it is correct press "&#10003;"
                on the device to sign your transaction and send it off.
            </div>
        </Fragment>


    // ...
    broadcastTransactionMessage = () =>
        <Fragment>
            <div className="bigger green">
                Your money transfer is on its way.
            </div>
            <div className="faded p-b">
                Estimated arrival time: 5 seconds
            </div>
            <LinearProgress
                style={{ background: "rgb(244,176,4)", }}
                color="rgba(15,46,83,0.6)"
                mode="indeterminate"
            />
        </Fragment>


    // ...
    sendingCompleteMessage = () =>
        <Fragment>
            <div className="bigger green">
                The money has arrived to its destination.
            </div>
            <div className="faded p-b">
                Thank you for using {appName}.
            </div>
        </Fragment>


    // ...
    changeButtonText = () =>
        this.setState({
            modalButtonText: "DONE",
        })


    // ...
    completeRegistration = (loginObj) => {
        this.changeButtonText()
        this.props.setAccountRegistered(true)
        this.props.changeLoginState({
            loginState: ActionConstants.LOGGED_IN,
            publicKey: this.props.appAuth.publicKey,
            bip32Path: this.props.appAuth.bip32Path,
            userId: loginObj.userId,
            token: loginObj.token,
        })
    }


    // ...
    render = () =>
        <div>
            <div>
                <Snackbar
                    open={this.state.sbPayment}
                    message={`${this.state.sbPaymentText} ${
                        this.state.sbPaymentAmount} ${
                        this.state.sbPaymentAssetCode}`}
                    onRequestClose={this.handlePaymentSnackbarClose}
                />

                <Modal
                    open={this.props.appUi.modals.signup ?
                        this.props.appUi.modals.signup.showing : false
                    }
                    title="Opening Your Bank - Register Account"
                    actions={[
                        <Button
                            label={this.state.modalButtonText}
                            onClick={this.hideSignupModal}
                            primary={true}
                        />,
                    ]}
                >
                    <Signup onComplete={this.completeRegistration}
                        config={{
                            useAsRegistrationForm: true,
                            publicKey: this.props.appAuth.publicKey,
                            bip32Path: this.props.appAuth.bip32Path,
                        }}
                    />
                </Modal>

            </div>

            {!this.props.accountInfo.registered &&
                !this.props.loginManager.isExploreOnly() ?
                <RegisterCard /> : null
            }

            {this.props.accountInfo.exists ?
                <BalancesCard notImplemented={this.handleOpen} /> :
                <NoAccountCard />
            }

            {
                this.props.appUi.cards.payment &&
                this.props.appUi.cards.payment.opened &&
                <PaymentCard onSignTransaction={this.sendPayment} />
            }
        </div>
}


// ...
export default withLoginManager(withAssetManager(connect(
    // map state to props.
    (state) => ({
        Account: state.Account,
        Balances: state.Balances,
        accountInfo: state.accountInfo,
        appAuth: state.appAuth,
        appUi: state.appUi,
    }),

    // match dispatch to props.
    (dispatch) => bindActionCreators({
        setState: AccountAction.setState,
        accountExistsOnLedger,
        accountMissingOnLedger,
        setAccountRegistered,
        setModalLoading,
        setModalLoaded,
        updateLoadingMessage,
        changeLoginState,
        changeModalState,
        changeSnackbarState,
        ActionConstants,
        togglePaymentCard,
    }, dispatch)
)(Balances)))
