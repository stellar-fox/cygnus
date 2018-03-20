import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import HeadingContainer from "./HeadingContainer"

import axios from "axios"
import RaisedButton from "material-ui/RaisedButton"

import Footer from "../Layout/Footer"
import Panel from "../Panel"
import Login from "../../containers/Login"

import { config } from "../../config"
import {
    pubKeyValid,
    federationAddressValid,
    federationLookup,
    StellarSdk,
    extractPathIndex,
} from "../../lib/utils"
import {
    appName,
    ledgerSupportLink
} from "../../env.js"

import {
    accountExistsOnLedger,
    accountMissingOnLedger,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    logIn,
    setHorizonEndPoint,
    setAccountRegistered,
    setAccountPath,
    setLedgerSoftwareVersion,
    setPublicKey,
    changeLoginState,
} from "../../actions/index"


import { setToken, clearToken } from "../../actions/auth"

import LedgerAuthenticator from "../LedgerAuthenticator"
import TextInputField from "../TextInputField"

import { ActionConstants } from "../../actions"
import PropTypes from "prop-types"

import "./index.css"


const styles = {
    errorStyle: {
        color: "#912d35",
    },
    underlineStyle: {
        borderColor: "#FFC107",
    },
    floatingLabelStyle: {
        color: "rgba(212,228,188,0.4)",
    },
    floatingLabelFocusStyle: {
        color: "rgba(212,228,188,0.2)",
    },
    inputStyle: {
        color: "rgb(244,176,4)",
    },
}

class Welcome extends Component {

    // ...
    static contextTypes = {
        loginManager: PropTypes.object,
    }

    // ...
    constructor (props) {
        super(props)
        this.state = {
            modalShown: false,
            modalButtonText: "CANCEL",
        }
    }



    // ...
    componentDidMount () {

        /*
         * Horizon end point is set to testnet by default.
         */
        this.props.setHorizonEndPoint(config.horizon)
    }

    // ...
    logInViaLedger (ledgerParams) {
        // TODO: fix this with Ledger API
        if (ledgerParams.errorCode !== null) {
            return
        }

        this.props.changeLoginState({
            loginState: ActionConstants.LOGGED_IN,
            publicKey: ledgerParams.publicKey,
            bip32Path: ledgerParams.bip32Path,
            userId: null,
            token: null,
        })

        this.props.setAccountPath(ledgerParams.bip32Path)
        this.props.setLedgerSoftwareVersion(ledgerParams.softwareVersion)
        this.ledgerAuthenticateUser(ledgerParams)
    }

    // ...
    logInViaPublicKey (pubKey) {

        if (this.context.loginManager.isAuthenticated()) {
            this.props.setAccountPath(`44'/148'/${this.props.appAuth.bip32Path}'`)
            axios
                .get(`${config.api}/account/${this.props.appAuth.userId}`)
                .then((response) => {
                    this.props.setAccountPath(`44'/148'/${response.data.data.bip32Path}'`)
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                })
        }

        try {
            this.props.setPublicKey(pubKey)
            // 1. show loading modal
            this.props.setModalLoading()

            // 2. load account info
            let server = new StellarSdk.Server(
                this.props.accountInfo.horizon
            )
            this.props.updateLoadingMessage({
                message: "Searching for Account ...",
            })
            server
                .loadAccount(pubKey)
                .catch(StellarSdk.NotFoundError, () => {
                    throw new Error("The destination account does not exist!")
                })
                .then((account) => {
                    this.props.accountExistsOnLedger({ account, })
                    this.props.setModalLoaded()
                    this.props.updateLoadingMessage({
                        message: null,
                    })
                })
                .catch(() => {
                    this.props.accountMissingOnLedger()
                    this.props.setModalLoaded()
                    this.props.updateLoadingMessage({
                        message: null,
                    })
                })

        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error)
        }
    }

    // ...
    handleSignup () {
        this.setState({
            modalButtonText: "CANCEL",
            modalShown: true,
        })
    }

    // ...
    handleModalClose () {
        this.setState({
            modalShown: false,
        })

        // VERY, VERY WRONG PLACE FOR THIS - BUT FOR NOW ... QUICK HACK
        if (this.props.accountInfo.pubKey) {
            this.logInViaPublicKey(this.props.accountInfo.pubKey, false)
            this.ledgerAuthenticateUser({
                publicKey: this.props.accountInfo.pubKey,
                bip32Path: this.props.accountInfo.accountPath,
                softwareVersion: this.props.auth.setLedgerSoftwareVersion,
            })
        }
    }

    // ...
    setModalButtonText (text) {
        this.setState({
            modalButtonText: text,
        })
    }


    // ...
    ledgerAuthenticateUser (ledgerParams) {
        axios
            .post(
                `${config.api}/user/ledgerauth/${
                    ledgerParams.publicKey
                }/${
                    extractPathIndex(ledgerParams.bip32Path)
                }`
            )
            .then((response) => {
                this.props.setAccountRegistered(true)
                this.props.logIn({
                    userId: response.data.user_id,
                    token: response.data.token,
                    pubkey: response.data.pubKey,
                })
            })
            .catch((error) => {
                // This will happen when back-end is offline.
                if (!error.response) {
                    console.log(error.message) // eslint-disable-line no-console
                    return
                }
                if (error.response.status === 401) {
                    console.log("Ledger user not found.") // eslint-disable-line no-console
                } else {
                    console.log(error.response.statusText) // eslint-disable-line no-console
                }
            })
    }


    // ...
    enterExplorer () {
        const textInputValue = this.textInputFieldFederationAddress.state.value
        this.props.setModalLoading()

        /**
         * textInputValue is either VALID federation or VALID pubkey
         * check for '*' character - if present then it is federation address
         * otherwise a public key
         */
        if (textInputValue.match(/\*/)) {
            this.props.updateLoadingMessage({
                message: "Looking up federation endpoint ...",
            })
            federationLookup(textInputValue)
                .then((federationEndpointObj) => {
                    if (federationEndpointObj.ok) {
                        axios
                            .get(`${
                                federationEndpointObj.endpoint
                            }?q=${
                                textInputValue
                            }&type=name`)
                            .then((response) => {
                                this.logInViaPublicKey(response.data.account_id)
                            })
                            .catch((error) => {
                                this.props.setModalLoaded()
                                if (error.response.status === 404) {
                                    this.textInputFieldFederationAddress.setState({
                                        error: "Account not found.",
                                    })
                                    return false
                                }
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
                    }
                })
                .catch((error) => {
                    this.props.setModalLoaded()
                    this.textInputFieldFederationAddress.setState({
                        error: error.message,
                    })
                })
        } else {
            this.logInViaPublicKey(textInputValue)
        }

    }


    // ...
    federationValidator () {
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
    compoundFederationValidator () {

        const addressValidity = this.federationValidator(
            this.textInputFieldFederationAddress.state.value
        )

        if (addressValidity === null) {
            return this.enterExplorer.call(this)
        } else {
            this.textInputFieldFederationAddress.setState({
                error: addressValidity,
            })
        }
    }

    // ...
    render () {

        return (
            <div className="welcome-content">
                <HeadingContainer />







                <div>
                    <div className="flex-row-space-between">
                        <Panel
                            className="welcome-panel-left"
                            title="Transact"
                            content={
                                <div>
                                    <img
                                        src="/img/ledger.svg"
                                        width="120px"
                                        alt="Ledger"
                                    />
                                    <div className="title">
                                        For full account
                                        functionality, authenticate
                                        with your Ledger device.
                                    </div>
                                    <div className="title-small p-t p-b">
                                        Connect your Ledger Nano S
                                        device. Make sure Stellar
                                        application is selected and
                                        browser support enabled. For
                                        more information visit{" "}
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={ledgerSupportLink}
                                        >
                                            Ledger Support
                                        </a>
                                    </div>
                                    <LedgerAuthenticator
                                        onConnected={this.logInViaLedger.bind(
                                            this
                                        )}
                                    />
                                </div>
                            }
                        />

                        <Panel
                            className="welcome-panel-center"
                            title="Customize"
                            content={
                                <div>
                                    <img
                                        style={{
                                            marginBottom: "4px",
                                        }}
                                        src="/img/sf.svg"
                                        width="140px"
                                        alt={appName}
                                    />
                                    <div className="title">
                                        Manage your account with ease.
                                    </div>
                                    <div className="title-small p-t">
                                        Once you have opened your
                                        account you can log in here
                                        to your banking terminal.
                                    </div>
                                    <div className="f-b">
                                        <Login/>
                                    </div>
                                </div>
                            }
                        />

                        <Panel
                            className="welcome-panel-right"
                            title="Explore"
                            content={
                                <div>
                                    <img
                                        src="/img/stellar.svg"
                                        width="120px"
                                        alt="Stellar"
                                    />
                                    <div className="title">
                                        To access global ledger
                                        explorer enter your{" "}
                                        <em>Payment Address</em> or{" "}
                                        <em>Account Number</em>.
                                    </div>
                                    <div className="title-small p-t p-b">
                                        Your account operations are
                                        publicly accessible on the
                                        global ledger. Anyone who
                                        knows your account number or
                                        payment address can view
                                        your public transactions.
                                    </div>
                                    <div className="title-small p-t p-b">
                                        <strong>
                                            Please note that this
                                            application will{" "}
                                            <u>never</u> ask you to
                                            enter your Secret key.
                                        </strong>
                                    </div>
                                    <div className="mui-text-input">
                                        <div>
                                            <TextInputField
                                                floatingLabelText="Payment Address"
                                                styles={styles}
                                                validator={this.federationValidator.bind(
                                                    this
                                                )}
                                                action={this.compoundFederationValidator.bind(
                                                    this
                                                )}
                                                ref={(self) => {
                                                    this.textInputFieldFederationAddress = self
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <RaisedButton
                                                onClick={this.compoundFederationValidator.bind(
                                                    this
                                                )}
                                                backgroundColor="rgb(244,176,4)"
                                                label="Check"
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        accountInfo: state.accountInfo,
        loadingModal: state.loadingModal,
        auth: state.auth,
        ui: state.ui,
        appAuth: state.appAuth,
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        accountExistsOnLedger,
        accountMissingOnLedger,
        setModalLoading,
        setModalLoaded,
        updateLoadingMessage,
        logIn,
        setHorizonEndPoint,
        setAccountRegistered,
        setAccountPath,
        setLedgerSoftwareVersion,
        setPublicKey,
        setToken,
        clearToken,
        changeLoginState,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
