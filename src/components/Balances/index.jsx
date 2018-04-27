import React, { Component, Fragment } from "react"
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
import axios from "axios"
import "number-to-text/converters/en-us"
import { action as AccountAction } from "../../redux/Account"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { action as BalancesAction } from "../../redux/Balances"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as ModalAction } from "../../redux/Modal"
import { action as AlertAction } from "../../redux/Alert"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import {
    insertPathIndex,
} from "../../lib/utils"
import {
    loadAccount,
    buildCreateAccountTx,
    buildPaymentTx,
    submitTransaction,
} from "../../lib/stellar-tx"
import { config } from "../../config"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import {
    ConnectedSwitch as Switch,
    resolvePath,
} from "../StellarRouter"
import { action as LoadingModalAction } from "../../redux/LoadingModal"
import Button from "../../lib/mui-v1/Button"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"
import RegisterCard from "./RegisterCard"
import BalancesCard from "./BalancesCard"
import NoAccountCard from "./NoAccountCard"
import PaymentCard from "./PaymentCard"
import TxConfirmMsg from "./TxConfirmMsg"
import TxBroadcastMsg from "./TxBroadcastMsg"
import TxCompleteMsg from "./TxCompleteMsg"
import {
    operationsStreamer,
    paymentsStreamer
} from "../Streamers"

import "./index.css"




// <Balances> component
class Balances extends Component {

    // ...
    static propTypes = {
        match: PropTypes.object.isRequired,
        setState: PropTypes.func.isRequired,
    }


    // ...
    constructor (props) {
        super(props)

        // relative resolve
        this.rr = resolvePath(this.props.match.path)
    }


    // ...
    state = {
        paymentsStreamer: null,
        operationsStreamer: null,
        modalButtonText: "CANCEL",
    }


    // ...
    componentDidMount = () => {
        this.setState({
            paymentsStreamer: paymentsStreamer(
                this.props.publicKey,
                this.props.popupSnackbar,
                this.props.updateAccountTree,
            ),
            operationsStreamer: operationsStreamer(
                this.props.publicKey,
                this.props.popupSnackbar,
                this.props.updateAccountTree,
            ),
        })
        if (!this.props.StellarAccount.accountId) {
            this.props.showLoadingModal("Searching for account ...")
            this._tmpQueryHorizon()
            if (this.props.loginManager.isPayEnabled()) {
                this._tmpAccountExists()
            }
        }
    }


    // ...
    componentWillUnmount = () => {
        this.state.paymentsStreamer.call(this)
        this.state.operationsStreamer.call(this)
        this.props.resetBalancesState()
    }


    // ...
    _tmpAccountExists = () => {
        axios.post(
            `${config.api}/user/ledgerauth/${
                this.props.publicKey
            }/${
                this.props.bip32Path
            }`
        ).then((response) => {
            this.props.setState({ needsRegistration: false, })
            axios.get(`${config.api}/account/${response.data.user_id}`)
                .then((r) => {
                    this.props.setState({currency: r.data.data.currency,})
                    this.props.assetManager.updateExchangeRate(
                        r.data.data.currency
                    )
                })
                .catch((_ex) => {
                    // nothing
                })
        }).catch((_error) => {
            this.props.setState({ needsRegistration: true, })
            // do nothing as this is only a check
        })
    }


    // ...
    _tmpQueryHorizon = async () => {
        try {
            const account = await loadAccount(this.props.publicKey)
            this.props.updateAccountTree(account)
            this.props.setState({ exists: true, })
        } catch (error) {
            this.props.setState({ exists: false, })
        } finally {
            this.props.hideLoadingModal()
        }
    }


    // ...
    buildSendTransaction = async () => {
        try {
            let tx = null
            const paymentData = {
                source: this.props.publicKey,
                destination: this.props.Balances.payee,
                amount: this.props.assetManager.convertToNative(
                    this.props.Balances.amount),
                memo: this.props.Balances.memoText,
            }
            if (this.props.Balances.newAccount) {
                tx = await buildCreateAccountTx(paymentData)
                this.props.setStateForBalances({
                    transactionType: "Create Acc",
                })
            } else {
                tx = await buildPaymentTx(paymentData)
                this.props.setStateForBalances({
                    transactionType: "Payment",
                })
            }

            this.props.showModal("txConfirm")

            const signedTx = await signTransaction(
                insertPathIndex(this.props.bip32Path),
                this.props.publicKey,
                tx
            )

            this.props.showModal("txBroadcast")

            const broadcast = await submitTransaction(signedTx)

            this.props.setStateForBalances({
                paymentId: broadcast.hash,
                ledgerId: broadcast.ledger,
            })

            this.props.setStateForBalances({
                transactionType: null,
            })

            this.props.showModal("txComplete")
            this.props.setBalancesState({
                payCardVisible: false,
            })
        } catch (error) {
            if (error.name === "BadResponseError") {
                this.showError(`${error.data.title}.`)
            } else {
                this.showError(error.message)
            }
        }
    }


    // ...
    showError = (message) => {
        this.props.hideModal()
        this.props.showAlert(message, "Error")
        this.props.setStateForBalances({
            sendEnabled: true,
            cancelEnabled: true,
            message: null,
        })
    }


    // ...
    sendPayment = async () => {
        this.props.setStateForBalances({
            sendEnabled: false,
            cancelEnabled: false,
            message: "Waiting for device ...",
        })
        try {
            await getSoftwareVersion()
            this.buildSendTransaction()
        } catch (ex) {
            this.showError(ex.message)
        }
    }


    // ...
    changeButtonText = () =>
        this.setState({
            modalButtonText: "DONE",
        })


    // ...
    completeRegistration = (loginObj) => {
        this.changeButtonText()
        this.props.setState({ needsRegistration: false, })
        this.props.setApiToken(loginObj.token)
        this.props.setUserId(loginObj.userId)
    }


    // ...
    render = () => (
        ({Balances, bip32Path, assetManager, loginManager, publicKey, }) =>
            <Switch>
                <Route exact path={this.rr(".")}>
                    <Fragment>
                        <Modal
                            open={
                                this.props.Modal.modalId === "signup" &&
                                this.props.Modal.visible
                            }
                            title="Opening Your Bank - Register Account"
                            actions={[
                                <Button
                                    onClick={this.props.hideModal}
                                    color="primary"
                                >{this.state.modalButtonText}</Button>,
                            ]}
                        >
                            <Signup onComplete={this.completeRegistration}
                                config={{
                                    useAsRegistrationForm: true,
                                    publicKey,
                                    bip32Path,
                                }}
                            />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txConfirm" &&
                                this.props.Modal.visible
                            }
                            title="Confirm on Hardware Device"
                        >
                            <TxConfirmMsg />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txBroadcast" &&
                                this.props.Modal.visible
                            }
                            title="Transmiting ..."
                        >
                            <TxBroadcastMsg />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txComplete" &&
                                this.props.Modal.visible
                            }
                            title="Transaction Complete"
                            actions={[
                                <Button
                                    onClick={this.props.hideModal}
                                    color="primary"
                                >OK</Button>,
                            ]}
                        >
                            <TxCompleteMsg
                                assetManager={assetManager}
                            />
                        </Modal>

                        {
                            this.props.Account.needsRegistration  &&
                            loginManager.isPayEnabled() ?
                                <RegisterCard /> : null
                        }

                        {
                            this.props.StellarAccount.accountId ?
                                <BalancesCard
                                    notImplemented={this.handleOpen}
                                /> :
                                <NoAccountCard />
                        }

                        {
                            Balances.payCardVisible ?
                                <PaymentCard
                                    onSignTransaction={this.sendPayment}
                                /> : null
                        }
                    </Fragment>
                </Route>
                <Redirect to={this.rr(".")} />
            </Switch>
    )(this.props)

}


// ...
export default compose(
    withAssetManager,
    withLoginManager,
    connect(
        // map state to props.
        (state) => ({
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            Account: state.Account,
            StellarAccount: state.StellarAccount,
            Balances: state.Balances,
            Modal: state.Modal,
        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            setBalancesState: BalancesAction.setState,
            updateAccountTree: StellarAccountAction.loadStellarAccount,
            setStateForBalances: BalancesAction.setState,
            resetBalancesState: BalancesAction.resetState,
            setApiToken: LoginManagerAction.setApiToken,
            setUserId: LoginManagerAction.setUserId,
            popupSnackbar: SnackbarAction.popupSnackbar,
            hideModal: ModalAction.hideModal,
            showModal: ModalAction.showModal,
            showAlert: AlertAction.showAlert,
            showLoadingModal: LoadingModalAction.showLoadingModal,
            hideLoadingModal: LoadingModalAction.hideLoadingModal,
        }, dispatch)
    )
)(Balances)
