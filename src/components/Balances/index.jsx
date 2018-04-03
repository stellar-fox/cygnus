import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import axios from "axios"

import numberToText from "number-to-text"
import { BigNumber } from "bignumber.js"
import "number-to-text/converters/en-us"

import { action as AccountAction } from "../../redux/Account"

import { signTransaction, awaitConnection } from "../../lib/ledger"
import {
    pubKeyValid,
    federationAddressValid,
    federationLookup,
    StellarSdk,
    pubKeyAbbr,
    handleException,
    insertPathIndex,
} from "../../lib/utils"
import { config } from "../../config"
import { appName } from "../StellarFox/env"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"

import {
    setExchangeRate,
    showAlert,
    hideAlert,
    setCurrency,
    setStreamer,
    setOptionsStreamer,
    setCurrencyPrecision,
    accountExistsOnLedger,
    accountMissingOnLedger,
    setAccountRegistered,
    logIn,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    changeLoginState,
    changeModalState,
    changeSnackbarState,
    ActionConstants,
} from "../../redux/actions"

import { List, ListItem } from "material-ui/List"
import Dialog from "material-ui/Dialog"
import LinearProgress from "material-ui/LinearProgress"
import Button from "../../lib/common/Button"
import Snackbar from "../../lib/common/Snackbar"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"
import RegisterCard from "./RegisterCard"
import BalancesCard from "./BalanceCard"
import NoAccountCard from "./NoAccountCard"
import PaymentCard from "./PaymentCard"
import "./index.css"




StellarSdk.Network.useTestNetwork()
const server = new StellarSdk.Server(config.horizon)




// <Balances> component
class Balances extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }

    // ...
    state = ((now) => ({
        sbPayment: false,
        sbPaymentAmount: null,
        sbPaymentAssetCode: null,
        modalShown: false,
        deviceConfirmModalShown: false,
        broadcastTxModalShown: false,
        errorModalShown: false,
        errorModalMessage: "",
        modalButtonText: "CANCEL",
        currencySymbol: null,
        currencyText: null,
        minDate: now,
        payDate: now,
        // the following are resetable
        amountEntered: false,
        payee: null,
        memoRequired: false,
        memo: "",
        amountValid: false,
        amount: 0,
        transactionType: null,
        memoValid: false,
        buttonSendDisabled: true,
        paymentCardVisible: false,
        newAccount: false,
        minimumReserveMessage: "",
        sendingCompleteModalShown: false,
        loginButtonDisabled: true,
    }))(new Date())


    // ...
    componentDidMount = () => {
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

        if (this.props.loginManager.isAuthenticated()) {
            axios.get(`${config.api}/account/${this.props.appAuth.userId}`)
                .then((response) => {
                    this.props.setCurrency(response.data.data.currency)
                    this.props.setCurrencyPrecision(
                        response.data.data.precision
                    )
                    this.getExchangeRate(response.data.data.currency)
                    this.setState({
                        currencySymbol: response.data.data.currency,
                        currencyText:
                            this.getCurrencyText(
                                response.data.data.currency
                            ),
                    })
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }

        this.getExchangeRate(this.props.Account.currency)
        this.setState({
            currencySymbol: this.props.Account.currency,
            currencyText:
                this.getCurrencyText(
                    this.props.Account.currency
                ),
        })

        // FIXME: merge streamers
        this.props.setStreamer(this.paymentsStreamer.call(this))
        this.props.setOptionsStreamer(this.optionsStreamer.call(this))
    }


    // ...
    componentWillUnmount = () => {
        this.props.accountInfo.streamer.call(this)
        this.props.accountInfo.optionsStreamer.call(this)
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
    getCurrencyText = (currency) => (
        (c) => c[Object.keys(c).filter((key) => key === currency)]
    )({
        eur: "EUROS",
        usd: "DOLLARS",
        aud: "AUSTRALIAN DOLLARS",
        nzd: "NEW ZEALAND DOLLARS",
        thb: "THAI BAHT บาท",
        pln: "ZŁOTYCH",
    })


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
    updateDate = (_, date) =>
        this.setState({
            payDate: date,
        })


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
    getNativeBalance = (account) => {
        let nativeBalance = 0

        account.balances.forEach((balance) => {
            if (balance.asset_type === "native") {
                nativeBalance = balance.balance
            }
        })

        return nativeBalance
    }


    // ...
    exchangeRateFetched = () => (
        this.props.accountInfo.rates  &&
            this.props.accountInfo.rates[this.props.Account.currency]
    )


    // ...
    exchangeRateStale = (currency) => (
        !this.props.accountInfo.rates  ||
            !this.props.accountInfo.rates[currency]  ||
            this.props.accountInfo.rates[currency].lastFetch + 300000 < Date.now()
    )


    // ...
    getExchangeRate = (currency) => {
        if (this.exchangeRateStale(currency)) {
            axios.get(`${config.api}/ticker/latest/${currency}`)
                .then((response) => {
                    this.props.setExchangeRate({[currency]: {
                        rate: response.data.data[`price_${currency}`],
                        lastFetch: Date.now(),
                    },})
                })
                .catch(function (error) {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }
    }


    // // ...
    // getOtherBalances = (account) =>
    //     account.balances.map((balance, index) => {
    //         if (balance.asset_type !== "native") {
    //             return (
    //                 <p className="other-assets" key={`${index}-${balance.asset_code}`}>
    //                     <span className="other-asset-balance">
    //                         {
    //                             Number.parseFloat(balance.balance)
    //                                 .toFixed(
    //                                     this.props.accountInfo.precision
    //                                 )
    //                         }
    //                     </span>
    //                     <span className="other-asset-code">
    //                         {balance.asset_code}
    //                     </span>
    //                 </p>
    //             )
    //         }
    //         return null
    //     })


    // ...
    handleOpen = () => this.props.showAlert()


    // ...
    handleClose = () => this.props.hideAlert()


    // ...
    closeSendingCompleteModal = () =>
        this.setState({
            sendingCompleteModalShown: false,
        })


    // ...
    handlePaymentSnackbarClose = () =>
        this.setState({
            sbPayment: false,
        })


    // ...
    handleModalClose = () =>
        axios
            .post(
                `${config.api}/user/ledgerauth/${
                    this.props.appAuth.publicKey
                }/${
                    this.props.appAuth.bip32Path
                }`
            )
            .then((response) => {
                this.props.setAccountRegistered(true)
                this.props.logIn({
                    userId: response.data.user_id,
                    token: response.data.token,
                })
                this.setState({
                    modalShown: false,
                })
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    // theoretically this should not happen
                    // eslint-disable-next-line no-console
                    console.log("Ledger user not found.")
                } else {
                    // eslint-disable-next-line no-console
                    console.log(error.response.statusText)
                }
            })


    // ...
    handleRegistrationModalClose = () =>
        this.setState({
            modalShown: false,
        })


    // ...
    handleSignup = () =>
        this.setState({
            modalButtonText: "CANCEL",
            modalShown: true,
        })


    // ...
    showSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: true,
            },
        })


    // ...
    hideSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: false,
            },
        })


    // ...
    setModalButtonText = (text) =>
        this.setState({
            modalButtonText: text,
        })


    // ...
    showPaymentCard = () =>
        this.setState({
            paymentCardVisible: true,
        })


    // ...
    hidePaymentCard = () =>
        this.setState({
            paymentCardVisible: false,
        })


    // ...
    queryStellarAccount = (pubKey) =>
        server.loadAccount(pubKey)
            .catch(StellarSdk.NotFoundError, (_) => {
                throw new Error("The destination account does not exist!")
            })
            .then((account) => {
                return this.getNativeBalance(account)
            })


    // ...
    buildSendTransaction = () => {
        let
            destinationId = this.state.payee,
            // Transaction will hold a built transaction we can resubmit
            // if the result is unknown.
            transaction = null

        if (this.state.newAccount) {

            // This function is "async"
            // as it waits for signature from the device
            server.loadAccount(this.props.appAuth.publicKey)
                .then(async (sourceAccount) => {
                    // Start building the transaction.
                    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
                        .addOperation(StellarSdk.Operation.createAccount({
                            destination: this.state.payee,
                            startingBalance:
                                this.props.assetManager.convertToNative(
                                    this.state.amount),
                        }))
                        .addMemo(
                            StellarSdk.Memo.text(
                                this.textInputFieldMemo.state.value
                            )
                        )
                        .build()

                    this.setState({
                        transactionType: "Create Account",
                        deviceConfirmModalShown: true,
                    })

                    // Sign the transaction to prove you are actually the person sending it.
                    // transaction.sign(sourceKeys)
                    const signedTransaction = await signTransaction(
                        insertPathIndex(this.props.appAuth.bip32Path),
                        this.props.appAuth.publicKey,
                        transaction
                    )

                    this.setState({
                        deviceConfirmModalShown: false,
                        broadcastTxModalShown: true,
                    })

                    // And finally, send it off to Stellar!
                    return server.submitTransaction(signedTransaction)
                })
                .then((_result) => {
                    // TODO: display xdr hash on receipt.
                    this.setState({
                        transactionType: null,
                        broadcastTxModalShown: false,
                        sendingCompleteModalShown: true,
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
                    })
                })
                .catch((error) => {
                    this.setState({
                        transactionType: null,
                        deviceConfirmModalShown: false,
                        broadcastTxModalShown: false,
                        sendingCompleteModalShown: false,
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
                    this.showErrorModal.call(this, error.message)
                })

        } else {

            // First, check to make sure that the destination account exists.
            // You could skip this, but if the account does not exist, you will be charged
            // the transaction fee when the transaction fails.
            server.loadAccount(destinationId)
                // If the account is not found, surface a nicer error message for logging.
                .catch(StellarSdk.NotFoundError, (_) => {
                    throw new Error("The destination account does not exist!")
                })
                // If there was no error, load up-to-date information on your account.
                .then(() => server.loadAccount(this.props.appAuth.publicKey))
                // This function is "async" as it waits for signature from the device
                .then(async (sourceAccount) => {
                    // Start building the transaction.
                    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
                        .addOperation(StellarSdk.Operation.payment({
                            destination: destinationId,
                            // Because Stellar allows transaction in many currencies, you must
                            // specify the asset type. The special "native" asset represents Lumens.
                            asset: StellarSdk.Asset.native(),
                            amount: this.props.assetManager.convertToNative(this.state.amount),
                        }))
                        // A memo allows you to add your own metadata to a transaction. It's
                        // optional and does not affect how Stellar treats the transaction.
                        .addMemo(StellarSdk.Memo.text(this.textInputFieldMemo.state.value))
                        .build()
                    // Sign the transaction to prove you are actually the person sending it.
                    // transaction.sign(sourceKeys)
                    this.setState({
                        transactionType: "Payment",
                        deviceConfirmModalShown: true,
                    })
                    const signedTransaction = await signTransaction(
                        insertPathIndex(this.props.appAuth.bip32Path),
                        this.props.appAuth.publicKey,
                        transaction
                    )
                    this.setState({
                        deviceConfirmModalShown: false,
                        broadcastTxModalShown: true,
                    })
                    // And finally, send it off to Stellar!
                    return server.submitTransaction(signedTransaction)
                })
                .then((_result) => {
                    //TODO: display xdr hash on receipt
                    this.setState({
                        transactionType: null,
                        broadcastTxModalShown: false,
                        sendingCompleteModalShown: true,
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
                    })
                })
                .catch((error) => {
                    this.setState({
                        transactionType: null,
                        deviceConfirmModalShown: false,
                        broadcastTxModalShown: false,
                        sendingCompleteModalShown: false,
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
                    this.showErrorModal.call(this, error.message)
                })
        }
    }


    // ...
    showErrorModal = (message) =>
        this.setState({
            errorModalShown: true,
            errorModalMessage: message,
        })


    // ...
    closeErrorModal = () =>
        this.setState({
            errorModalShown: false,
            errorModalMessage: "",
        })


    // ...
    sendPayment = async () => {
        // check if device is connected first (if not deviceCheck is an error object)
        const deviceCheck = await awaitConnection()

        if (typeof deviceCheck === "string") {
            this.buildSendTransaction.call(this)
            return true
        } else {
            this.showErrorModal.call(this, deviceCheck.message)
            return false
        }
    }


    // ...
    compoundPaymentValidator = () => {
        if (
            this.state.newAccount  &&
            this.state.amountEntered  &&
            parseInt(this.props.assetManager.convertToNative(
                this.state.amount), 10) <
                    parseInt(config.reserve, 10)
        ) {
            this.setState({
                buttonSendDisabled: true,
                minimumReserveMessage:
                    `Minimum reserve of ${config.reserve} required.`,
            })
            return false
        }

        if (!this.state.payee) {
            this.setState({
                buttonSendDisabled: true,
            })
            return false
        }

        if (!this.state.amountEntered) {
            this.setState({
                buttonSendDisabled: true,
                minimumReserveMessage: "",
            })
            return false
        }

        if (!(BigNumber(this.state.amount) > BigNumber("0"))) {
            this.setState({
                buttonSendDisabled: true,
            })
            return false
        }

        if (!this.state.memoValid && this.state.memoRequired) {
            this.setState({
                buttonSendDisabled: true,
            })
            return false
        }

        this.setState({
            buttonSendDisabled: false,
            minimumReserveMessage: "",
        })

        return true
    }


    // ...
    memoValidator = () => {
        if (
            this.state.memoRequired  &&
            this.textInputFieldMemo.state.value === ""
        ) {
            this.setState({
                memoValid: false,
                memo: "",
            })
        } else {
            this.setState({
                memoValid: true,
                memo: this.textInputFieldMemo.state.value,
            })
        }

        this.compoundPaymentValidator.call(this)

        return true
    }


    // ...
    amountValidator = () => {
        // nothing was typed (reset any previous errors)
        if (this.textInputFieldAmount.state.value === "") {
            this.setState({
                amountEntered: false,
                amountValid: false,
            })
            this.textInputFieldAmount.setState({
                error: null,
            })
            this.compoundPaymentValidator.call(this)
            return null
        }

        let parsedValidAmount = this.textInputFieldAmount.state.value.match(
            /^(\d+)([.,](\d{1,2}))?$/
        )

        // check if amount typed is valid
        if (parsedValidAmount) {
            // decimals present
            if (parsedValidAmount[3]) {
                this.setState({
                    amount: `${parsedValidAmount[1]}.${parsedValidAmount[3]}`,
                    amountEntered: true,
                    amountText:
                        `${numberToText.convertToText(
                            parsedValidAmount[1]
                        )} and ${parsedValidAmount[3]}/100`,
                })
            }
            // whole amount
            else {
                this.setState({
                    amount: `${parsedValidAmount[1]}`,
                    amountEntered: true,
                    amountText:
                        numberToText.convertToText(parsedValidAmount[1]),
                })
            }
            this.textInputFieldAmount.setState({
                error: null,
            })
            this.compoundPaymentValidator.call(this)
            return null
        }

        // invalid amount was typed in
        else {
            this.setState({
                amountEntered: false,
            })
            this.textInputFieldAmount.setState({
                error: "invalid amount entered",
            })
            this.compoundPaymentValidator.call(this)
            return "invalid amount entered"
        }

    }


    // ...
    federationValidator = () => {
        // reset any previous errors
        this.textInputFieldFederationAddress.setState({
            error: null,
        })

        const address = this.textInputFieldFederationAddress.state.value
        // Looks like something totally invalid for this field.
        if (!address.match(/\*/) && !address.match(/^G/)) {
            return "invalid input"
        }
        // Looks like user is entering Federation Address format.
        if (address.match(/\*/) && !federationAddressValid(address)) {
            return "invalid federation address"
        }
        // This must be an attempt at a Stellar public key format.
        if (address.match(/^G/) && !address.match(/\*/)) {
            let publicKeyValidityObj = pubKeyValid(address)
            if (!publicKeyValidityObj.valid) {
                return publicKeyValidityObj.message
            }
        }

        return null
    }


    // ...
    compoundFederationValidator = () => {
        const addressValidity = this.federationValidator(
            this.textInputFieldFederationAddress.state.value
        )
        if (addressValidity === null) {

            // valid federation address
            if (this.textInputFieldFederationAddress.state.value.match(/\*/)) {
                federationLookup(this.textInputFieldFederationAddress.state.value)
                    .then((federationEndpointObj) => {
                        if (federationEndpointObj.ok) {
                            axios
                                .get(`${
                                    federationEndpointObj.endpoint
                                }?q=${
                                    this.textInputFieldFederationAddress
                                        .state.value
                                }&type=name`)
                                .then((response) => {
                                    this.queryStellarAccount(
                                        response.data.account_id
                                    )
                                        .catch((_) => {
                                            this.setState({
                                                payee: response.data.account_id,
                                                newAccount: true,
                                            })
                                            this.compoundPaymentValidator
                                                .call(this)
                                            throw new Error(
                                                "The destination account does not exist!"
                                            )
                                        })
                                        .then((_) => {
                                            this.setState({
                                                payee: response.data.account_id,
                                                newAccount: false,
                                            })
                                            this.compoundPaymentValidator.call(this)
                                        })
                                        .catch((error) => {
                                            // eslint-disable-next-line no-console
                                            console.log(error.message)
                                        })
                                })
                                .catch((error) => {
                                    this.setState({
                                        payee: null,
                                        newAccount: false,
                                    })
                                    this.compoundPaymentValidator.call(this)
                                    if (error.response.data.detail) {
                                        this.textInputFieldFederationAddress.setState({
                                            error: error.response.data.detail,
                                        })
                                    } else {
                                        this.textInputFieldFederationAddress.setState({
                                            error: error.response.data.message,
                                        })
                                    }
                                })
                        } else {
                            this.setState({
                                payee: null,
                            })
                            this.compoundPaymentValidator.call(this)
                            this.textInputFieldFederationAddress.setState({
                                error: federationEndpointObj.error.message,
                            })
                        }
                    })
                    .catch((error) => {
                        this.setState({
                            payee: null,
                            newAccount: false,
                        })
                        this.compoundPaymentValidator.call(this)
                        this.textInputFieldFederationAddress.setState({
                            error: error.message,
                        })
                        // eslint-disable-next-line no-console
                        console.log(error)
                    })
            }

            // valid public key
            else {
                this.queryStellarAccount(
                    this.textInputFieldFederationAddress.state.value
                )
                    .catch((_) => {
                        this.setState({
                            payee:
                                this.textInputFieldFederationAddress
                                    .state.value,
                            newAccount: true,
                        })
                        this.compoundPaymentValidator.call(this)
                        throw new Error(
                            "The destination account does not exist!"
                        )
                    })
                    .then((_) => {
                        this.setState({
                            payee:
                                this.textInputFieldFederationAddress
                                    .state.value,
                            newAccount : false,
                        })
                        this.compoundPaymentValidator.call(this)
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error.message)
                    })
            }

        } else {

            this.setState({
                newAccount: false,
                payee: null,
            })

        }
    }


    // ...
    recipientIndicatorMessage = () => {
        let message = <span className="fade-extreme">XXXXXXXXXXXX</span>

        if (this.state.payee) {
            message = <span className="green">Recipient Verified</span>
        }

        if (this.state.newAccount) {
            message = <span className="red">New Account</span>
        }

        return message
    }


    // ...
    bottomIndicatorMessage = () => {
        let message = (<div className="p-l nowrap fade-extreme">
            <span className="bigger">
                &#x1D54A;&#x1D543;
                {" "}
                {this.props.accountInfo.account.account.sequence}
            </span>
        </div>)

        if (this.state.memoRequired && !this.state.memoValid) {
            message = (<div className='fade p-l nowrap red'>
                <i className="material-icons md-icon-small">assignment_late</i>
                Payment recipient requires Memo entry!
            </div>)
        }

        if (this.state.minimumReserveMessage !== "") {
            message = (<div className='fade p-l nowrap red'>
                <i className="material-icons md-icon-small">assignment_late</i>
                {this.state.minimumReserveMessage}
            </div>)
        }

        return message
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
                        `${this.props.assetManager.convertToNative(this.state.amount)} XLM`
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
                            () => pubKeyAbbr(this.state.payee),
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
                    secondaryText={this.state.memo}
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
    doWhateverYourFunctionCurrentlyIs = () =>
        this.setState({
            modalShown: false,
        })


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
    render = () => {

        const
            actions = [
                <Button
                    primary={true}
                    label="OK"
                    keyboardFocused={true}
                    onClick={this.handleClose}
                />,
            ],
            actionsError = [
                <Button
                    primary={true}
                    label="OK"
                    keyboardFocused={true}
                    onClick={this.closeErrorModal}
                />,
            ],
            actionsSendingComplete = [
                <Button
                    primary={true}
                    label="OK"
                    keyboardFocused={true}
                    onClick={this.closeSendingCompleteModal}
                />,
            ]

        return (
            <div>
                <div>
                    <Snackbar
                        open={this.state.sbPayment}
                        message={
                            `${
                                this.state.sbPaymentText
                            } ${
                                this.state.sbPaymentAmount
                            } ${
                                this.state.sbPaymentAssetCode
                            }`
                        }
                        onRequestClose={
                            this.handlePaymentSnackbarClose
                        }
                    />

                    <Dialog
                        title="Not Yet Implemented"
                        actions={actions}
                        modal={false}
                        open={this.props.modal.isShowing}
                        onRequestClose={this.handleClose}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                    >
                        Pardon the mess. We are working hard to bring you this feature very
                        soon. Please check back in a while as the feature implementation
                        is being continuously deployed.
                    </Dialog>


                    <Modal
                        open={
                            typeof this.props.appUi.modals !== "undefined" &&
                                typeof this.props.appUi.modals.signup !== "undefined" ?
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
                        <Signup onComplete={this.completeRegistration} config={{
                            register: true,
                            publicKey: this.props.appAuth.publicKey,
                            bip32Path: this.props.appAuth.bip32Path,
                        }} />
                    </Modal>




                    <Dialog
                        title={
                            <div>
                                <i className="material-icons">
                                    developer_board
                                </i> Confirm on Ledger
                            </div>
                        }
                        actions={null}
                        modal={true}
                        open={this.state.deviceConfirmModalShown}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                    >
                        {this.transactionFeedbackMessage.call(this)}
                    </Dialog>

                    <Dialog
                        title={
                            <div className="header-icon">
                                <i className="material-icons">send</i>
                                <span>Sending Payment</span>
                            </div>
                        }
                        actions={null}
                        modal={true}
                        open={this.state.broadcastTxModalShown}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                    >
                        {this.broadcastTransactionMessage.call(this)}
                    </Dialog>

                    <Dialog
                        title="Error"
                        actions={actionsError}
                        modal={false}
                        open={this.state.errorModalShown}
                        onRequestClose={this.closeErrorModal}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                    >
                        {this.state.errorModalMessage}
                    </Dialog>

                    <Dialog
                        title={
                            <div className="header-icon">
                                <i className="material-icons">send</i>
                                <span>Transfer complete.</span>
                            </div>
                        }
                        actions={actionsSendingComplete}
                        modal={true}
                        open={this.state.sendingCompleteModalShown}
                        onRequestClose={this.closeSendingCompleteModal}
                        paperClassName="modal-body"
                        titleClassName="modal-title"
                    >
                        {this.sendingCompleteMessage.call(this)}
                    </Dialog>
                </div>

                {!this.props.accountInfo.registered &&
                    !this.props.loginManager.isExploreOnly() ?
                    <RegisterCard /> : null
                }

                {this.props.accountInfo.exists ?
                    <BalancesCard /> : <NoAccountCard />
                }

                {
                    this.props.appUi.cards.payment &&
                    this.props.appUi.cards.payment.opened && <PaymentCard />
                }
            </div>
        )
    }
}


// ...
export default withLoginManager(withAssetManager(connect(
    // map state to props.
    (state) => ({
        Account: state.Account,
        accountInfo: state.accountInfo,
        auth: state.auth,
        modal: state.modal,
        appAuth: state.appAuth,
        appUi: state.appUi,
    }),

    // match dispatch to props.
    (dispatch) => bindActionCreators({
        setState: AccountAction.setState,
        setExchangeRate,
        showAlert,
        hideAlert,
        setCurrency,
        setStreamer,
        setOptionsStreamer,
        setCurrencyPrecision,
        accountExistsOnLedger,
        accountMissingOnLedger,
        setAccountRegistered,
        logIn,
        setModalLoading,
        setModalLoaded,
        updateLoadingMessage,
        changeLoginState,
        changeModalState,
        changeSnackbarState,
        ActionConstants,
    }, dispatch)
)(Balances)))
