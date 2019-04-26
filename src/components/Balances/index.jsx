import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"
import "number-to-text/converters/en-us"
import {
    delay,
    string,
} from "@xcmats/js-toolbox"
import { action as AccountAction } from "../../redux/Account"
import { action as AssetManagerAction } from "../../redux/AssetManager"
import { action as BankActions } from "../../redux/Bank"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { action as BalancesAction } from "../../redux/Balances"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as ModalAction } from "../../redux/Modal"
import { action as AlertAction } from "../../redux/Alert"
import { action as TransactionAction } from "../../redux/Transaction"
import { signTransaction } from "../../lib/ledger"
import {
    augmentAssets,
    insertPathIndex,
} from "../../lib/utils"
import {
    buildCreateAccountTx,
    buildPaymentTx,
    submitTransaction,
} from "../../lib/stellar-tx"
import {
    ConnectedSwitch as Switch,
    resolvePath,
} from "../StellarRouter"
import { action as LoadingModalAction } from "../../redux/LoadingModal"
import Button from "../../lib/mui-v1/Button"
import Modal from "../../lib/common/Modal"
import RegisterCard from "./RegisterCard"
import NoAccountCard from "./NoAccountCard"
import PaymentCard from "./PaymentCard"
import TxConfirmMsg from "./TxConfirmMsg"
import TxBroadcastMsg from "./TxBroadcastMsg"
import TxCompleteMsg from "./TxCompleteMsg"
import TxCustomAssetCompleteMsg from "./TxCustomAssetCompleteMsg"
import {
    operationsStreamer,
    paymentsStreamer
} from "../Streamers"
import "./index.css"
import FundCard from "./FundCard"
import AssetDetails from "./AssetDetails"
import { surfaceSnacky } from "../../thunks/main"
import { queryDevice } from "../../thunks/ledgerhq"
import AssetGrid from "./AssetGrid"
import BalanceSummary from "./BalanceSummary"
import LoadingModal from "../LoadingModal"
import {
    blinkPayentStreamerLed,
    streamerPaymentConnected,
    blinkOperationStreamerLed,
    streamerOperationConnected,
} from "../../thunks/main"




// <Balances> component
class Balances extends Component {


    // ...
    static propTypes = {
        match: PropTypes.object.isRequired,
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
                this.props.blinkPayentStreamerLed,
                this.props.streamerPaymentConnected,
                this.props.surfaceSnacky,
                this.props.publicKey,
                this.props.horizon,
                this.updateAccountTree,
            ),
            operationsStreamer: operationsStreamer(
                this.props.blinkOperationStreamerLed,
                this.props.streamerOperationConnected,
                this.props.surfaceSnacky,
                this.props.publicKey,
                this.props.horizon,
                this.updateAccountTree,
            ),
        })

    }




    // ...
    componentWillUnmount = () => {
        this.state.paymentsStreamer.call(this)
        this.props.streamerPaymentConnected(false)
        this.state.operationsStreamer.call(this)
        this.props.streamerOperationConnected(false)
        this.props.resetBalancesState()
    }




    // ...
    updateAccountTree = (account) => {
        this.props.setAssetsState({ loading: true })
        this.props.updateAccountTree(account)
        delay(300).then(() => {
            augmentAssets(
                this.props.StellarAccount.assets
            ).then((augmentedAssets) => {
                this.props.setStellarAccountState({
                    assets: augmentedAssets,
                })
                this.props.setAssetsState({ loading: false })
            })

        })
    }




    // ...
    buildSendTransaction = async () => {
        try {
            let tx = null
            const paymentData = {
                source: this.props.publicKey,
                destination: this.props.Balances.payee,
                amount: this.props.Balances.amountNative,
                memo: this.props.Balances.memoText,
                network: this.props.horizon,
            }
            if (this.props.Balances.newAccount) {
                tx = await buildCreateAccountTx(paymentData)
                this.props.setStateForBalances({
                    transactionType: "Create Account",
                })
            } else {
                tx = await buildPaymentTx(paymentData)
                this.props.setStateForBalances({
                    transactionType: "Payment",
                })
            }

            this.props.setStateForBalances({ message: string.empty() })

            this.props.showModal("txConfirm")

            this.props.setTransaction(tx)

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
            this.showError(error.message)
        }
    }




    // ...
    showError = (message) => {
        this.props.clearTransaction()
        this.props.hideModal()
        this.props.setStateForBalances({
            sendEnabled: true,
            cancelEnabled: true,
            message: null,
        })
        this.props.surfaceSnacky("error", message)
    }




    // ...
    sendPayment = async () => {
        this.props.setStateForBalances({
            sendEnabled: false,
            cancelEnabled: false,
            message: "Waiting for device ...",
        })
        try {
            await this.props.queryDevice()
            this.buildSendTransaction()
        } catch (error) {
            this.showError(error.message)
        }
    }




    // ...
    closeAssetDetailsModal = () => {
        this.props.setAssetsState({ selected: null })
        this.props.setBalancesState({
            amount: string.empty(),
            payee: null,
            paymentAddress: null,
            payeeStellarAccount: null,
            transactionAsset: null,
        })
        this.props.hideModal()
    }




    // ...
    render = () => (
        ({ Balances, signupHintVisible }) =>
            <Switch>
                <Route exact path={this.rr(".")}>
                    <Fragment>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txConfirm" &&
                                this.props.Modal.visible
                            }
                        >
                            <TxConfirmMsg />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txBroadcast" &&
                                this.props.Modal.visible
                            }
                        >
                            <TxBroadcastMsg
                                title="Your transaction is on its way!"
                            />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txComplete" &&
                                this.props.Modal.visible
                            }
                            actions={[
                                <Button
                                    onClick={this.props.hideModal}
                                    color="primary"
                                >OK</Button>,
                            ]}
                        >
                            <TxCompleteMsg />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "txCustomAssetComplete" &&
                                this.props.Modal.visible
                            }
                            title="Transaction Receipt"
                            actions={[
                                <Button
                                    onClick={this.props.hideModal}
                                    color="primary"
                                >OK</Button>,
                            ]}
                        >
                            <TxCustomAssetCompleteMsg />
                        </Modal>

                        <Modal
                            open={
                                this.props.Modal.modalId === "assetDetails" &&
                                this.props.Modal.visible
                            }
                            title={string.empty()}
                            paperClassName="paycheck"
                            bodyClassName="lace"
                        >
                            <AssetDetails />
                        </Modal>

                        {
                            this.props.Account.needsRegistration &&
                            signupHintVisible && <RegisterCard />
                        }


                        {this.props.StellarAccount.loading ?
                            <LoadingModal /> :
                            this.props.StellarAccount.accountId ?
                                <BalanceSummary className="m-b" /> :
                                <NoAccountCard className="m-b" />
                        }


                        {
                            Balances.fundCardVisible && <FundCard />
                        }


                        {
                            Balances.payCardVisible &&
                            <PaymentCard onSignTransaction={this.sendPayment} />
                        }

                        {
                            !this.props.StellarAccount.loading &&
                            this.props.StellarAccount.assets &&
                            <AssetGrid />
                        }


                    </Fragment>
                </Route>
                <Redirect to={this.rr(".")} />
            </Switch>
    )(this.props)

}




// ...
export default connect(
    // map state to props.
    (state) => ({
        authenticated: state.Auth.authenticated,
        publicKey: state.LedgerHQ.publicKey,
        bip32Path: state.LedgerHQ.bip32Path,
        Account: state.Account,
        StellarAccount: state.StellarAccount,
        Balances: state.Balances,
        Modal: state.Modal,
        userId: state.LoginManager.userId,
        token: state.LoginManager.token,
        horizon: state.StellarAccount.horizon,
        assets: state.Assets,
        cancelEnabled: state.Balances.cancelEnabled,
        signupHintVisible: state.Bank.signupHintVisible,
    }),
    // match dispatch to props.
    (dispatch) => bindActionCreators({
        clearTransaction: TransactionAction.clearTransaction,
        setAccountState: AccountAction.setState,
        setAssetsState: AssetManagerAction.setState,
        setBalancesState: BalancesAction.setState,
        setContactsState: ContactsAction.setState,
        setLedgerHQState: LedgerHQAction.setState,
        setStellarAccountState: StellarAccountAction.setState,
        setTransaction: TransactionAction.setTransaction,
        updateAccountTree: StellarAccountAction.updateAccountAttributes,
        setStateForBalances: BalancesAction.setState,
        resetBalancesState: BalancesAction.resetState,
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
        hideModal: ModalAction.hideModal,
        showModal: ModalAction.showModal,
        showAlert: AlertAction.showAlert,
        showLoadingModal: LoadingModalAction.showLoadingModal,
        hideLoadingModal: LoadingModalAction.hideLoadingModal,
        toggleSignupHint: BankActions.toggleSignupHint,
        surfaceSnacky,
        queryDevice,
        blinkPayentStreamerLed,
        streamerPaymentConnected,
        blinkOperationStreamerLed,
        streamerOperationConnected,
    }, dispatch)
)(Balances)
