import React, { Component, Fragment } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import axios from "axios"
import "number-to-text/converters/en-us"
import { action as AccountAction } from "../../redux/Account"
import { action as BalancesAction } from "../../redux/Balances"
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
import Button from "../../lib/common/Button"
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
        setState: PropTypes.func.isRequired,
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
                this.props.appAuth.publicKey,
                this.props.changeSnackbarState,
                this.props.accountExistsOnLedger
            ),
            operationsStreamer: operationsStreamer(
                this.props.appAuth.publicKey,
                this.props.changeSnackbarState,
                this.props.accountExistsOnLedger
            ),
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
        this.state.operationsStreamer.call(this)
        this.props.resetBalancesState()
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
    _tmpQueryHorizon = async () => {
        try {
            const account = await loadAccount(this.props.appAuth.publicKey)
            this.props.accountExistsOnLedger({ account, })
            this.props.setState({ exists: true, })
        } catch (error) {
            this.props.accountMissingOnLedger()
            this.props.setState({ exists: false, })
        } finally {
            this.props.setModalLoaded()
        }
    }


    // ...
    hideSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: false,
            },
        })


    // ...
    hideTxCompleteModal = () =>
        this.props.changeModalState({
            txCompleteMsg: {
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
                this.props.setStateForBalances({
                    transactionType: "Create Acc",
                })
            } else {
                tx = await buildPaymentTx(paymentData)
                this.props.setStateForBalances({
                    transactionType: "Payment",
                })
            }

            this.props.changeModalState({
                txConfirmMsg: { showing: true, },
            })

            const signedTx = await signTransaction(
                insertPathIndex(this.props.appAuth.bip32Path),
                this.props.appAuth.publicKey,
                tx
            )

            this.props.changeModalState({
                txBroadcastMsg: { showing: true, },
            })

            const broadcast = await submitTransaction(signedTx)

            this.props.setStateForBalances({
                paymentId: broadcast.hash,
                ledgerId: broadcast.ledger,
            })

            this.props.setStateForBalances({
                transactionType: null,
            })

            this.props.changeModalState({
                txCompleteMsg: { showing: true, },
            })

            this.props.togglePaymentCard({
                payment: {
                    opened: false,
                },
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
        this.props.changeModalState({
            alertWithDismiss: {
                showing: true,
                title: "Error",
                content: message,
            },
        })
        this.props.setStateForBalances({
            sendIsDisabled: false,
        })
    }


    // ...
    sendPayment = async () => {
        this.props.setStateForBalances({
            sendIsDisabled: true,
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
    render = () => <Fragment>

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

        <Modal
            open={this.props.appUi.modals.txConfirmMsg ?
                this.props.appUi.modals.txConfirmMsg.showing : false
            }
            title="Confirm on Hardware Device"
        >
            <TxConfirmMsg />
        </Modal>

        <Modal
            open={this.props.appUi.modals.txBroadcastMsg ?
                this.props.appUi.modals.txBroadcastMsg.showing : false
            }
            title="Transmiting ..."
        >
            <TxBroadcastMsg />
        </Modal>

        <Modal
            open={this.props.appUi.modals.txCompleteMsg ?
                this.props.appUi.modals.txCompleteMsg.showing : false
            }
            title="Transaction Complete"
            actions={[
                <Button
                    label="OK"
                    onClick={this.hideTxCompleteModal}
                    primary={true}
                />,
            ]}
        >
            <TxCompleteMsg />
        </Modal>


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

    </Fragment>
}


// ...
export default compose(
    withAssetManager,
    withLoginManager,
    connect(
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
            setStateForBalances: BalancesAction.setState,
            resetBalancesState: BalancesAction.resetState,
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
    )
)(Balances)
