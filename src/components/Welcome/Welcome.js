import React, {Component} from "react"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import Footer from "../Footer"
import LoadingModal from "../LoadingModal"
import Dialog from "material-ui/Dialog"
import { emailValid, passwordValid, pubKeyValid, federationAddressValid, federationLookup } from "../../lib/utils"
import CreateAccountStepper from "../CreateAccount/CreateAccount"
import {config} from "../../config"
import axios from "axios"
import {
    accountExistsOnLedger,
    accountMissingOnLedger,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    logInToHorizon,
    logOutOfHorizon,
    logIn,
    selectView,
    setHorizonEndPoint,
    setAccountRegistered,
    setAccountPath,
    setLedgerSoftwareVersion,
    setPublicKey,

} from "../../actions/index"
import Panel from "../Panel"

import LedgerAuthenticator from "../LedgerAuthenticator"
import TextInputField from "../TextInputField"

import "./Welcome.css"

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
    constructor(props) {
        super(props)
        this.state = {
            modalShown: false,
            modalButtonText: 'CANCEL',
        }
    }


    // ...
    componentDidMount(){
        /*
        * Horizon end point is set to testnet by default.
        */
        this.props.setHorizonEndPoint(config.horizon)
    }


    // ...
    logInViaLedger(ledgerParams) {
        this.props.setAccountPath(ledgerParams.bip32Path)
        this.props.setLedgerSoftwareVersion(ledgerParams.softwareVersion)
        this.logInViaPublicKey(ledgerParams.publicKey, false)
    }


    // ...
    logInViaPublicKey(pubKey, isReadOnly=true) {
        try {
            this.props.setPublicKey(pubKey)
            // 1. show loading modal
            this.props.setModalLoading()

            // 2. load account info
            let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
            this.props.updateLoadingMessage({
                message: "Searching for Account ...",
            })
            server.loadAccount(pubKey).catch(window.StellarSdk.NotFoundError, () => {
                throw new Error("The destination account does not exist!")
            }).then((account) => {
                this.props.accountExistsOnLedger({account})
                this.props.selectView("Balances")
                this.props.logInToHorizon({isReadOnly})
                this.props.setModalLoaded()
                this.props.updateLoadingMessage({
                    message: null,
                })
            }).catch(() => {
                this.props.accountMissingOnLedger()
                this.props.selectView("Balances")
                this.props.logInToHorizon({ isReadOnly })
                this.props.setModalLoaded()
                this.props.updateLoadingMessage({
                    message: null,
                })
            })

            // 3. check if user created account with Stellar Fox
            axios.get(`${config.api}/find/publickey/${pubKey}`).then((response) => {
                if (parseInt(response.data.data.count, 10) === 0) {
                    this.props.setAccountRegistered(false)
                } else {
                    this.props.setAccountRegistered(true)
                }
            }).catch((error) => {
                console.log(error) // eslint-disable-line no-console
            })

        } catch (error) {
            console.log(error) // eslint-disable-line no-console
        }
    }


    // ...
    handleSignup() {
        this.setState({
            modalButtonText: "CANCEL",
            modalShown: true,
        })
    }


    // ...
    handleModalClose() {
        this.setState({
            modalShown: false,
        })
    }


    // ...
    setModalButtonText(text) {
        this.setState({
            modalButtonText: text
        })
    }


    // ...
    authenticateUser() {
        if (this.textInputFieldEmail.state.value !== "" && this.textInputFieldPassword.state.value !== "") {
            axios.post(`${config.api}/user/authenticate/${this.textInputFieldEmail.state.value}/${this.textInputFieldPassword.state.value}`)
                .then((response) => {
                    this.textInputFieldEmail.setState({
                        error: null,
                    })
                    this.textInputFieldPassword.setState({
                        error: null,
                    })
                    this.props.logIn({
                        userId: response.data.user_id,
                        token: response.data.token,
                    })
                    this.logInViaPublicKey(response.data.pubkey)
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        this.textInputFieldEmail.setState({
                            error: "possibly incorrect email"
                        })
                        this.textInputFieldPassword.setState({
                            error: "possibly incorrect password"
                        })
                    } else {
                        console.log(error.response.statusText) // eslint-disable-line no-console
                    }
                })
        }
    }


    // ...
    enterExplorer() {
        const textInputValue = this.textInputFieldFederationAddress.state.value
        this.props.setModalLoading()
        this.props.updateLoadingMessage({ message: "Looking up federation endpoint ..." })

        // Input entered is a valid Stellar Federation address
        federationLookup(textInputValue)
            .then((federationEndpointObj) => {
                if (federationEndpointObj.ok) {
                    axios.get(`${federationEndpointObj.endpoint}?q=${textInputValue}&type=name`)
                        .then((response) => {
                            this.logInViaPublicKey(response.data.account_id)
                        })
                        .catch((error) => {
                            this.props.setModalLoaded()
                            if (error.response.data.detail) {
                                this.textInputFieldFederationAddress.setState({
                                    error: error.response.data.detail
                                })
                            } else {
                                this.textInputFieldFederationAddress.setState({
                                    error: error.response.data.message
                                })
                            }
                        })
                } else {
                    this.props.setModalLoaded()
                    this.textInputFieldFederationAddress.setState({
                        error: federationEndpointObj.error
                    })
                }
            })

        // Input entered is a valid Stellar PublicKey
        if (pubKeyValid(textInputValue).valid) {
            this.logInViaPublicKey(textInputValue)
        }
    }


    // ...
    emailValidator(email) {
        return !emailValid(email) ? "invalid email" : null
    }


    // ...
    passwordValidator(password) {
        return !passwordValid(password) ? "invalid password" : null
    }


    // ...
    compoundLoginValidator() {
        const emailValidity = this.emailValidator(this.textInputFieldEmail.state.value)
        const passwordValidity = this.passwordValidator(this.textInputFieldPassword.state.value)
        if (emailValidity === null && passwordValidity === null) {
            return this.authenticateUser.call(this)
        }
    }


    // ...
    federationValidator() {
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
    compoundFederationValidator() {
        const addressValidity = this.federationValidator(this.textInputFieldFederationAddress.state.value)
        if (addressValidity === null) {
            return this.enterExplorer.call(this)
        }
    }


  // ...
  render() {

    const actions = [
      <FlatButton
        backgroundColor="rgb(244,176,4)"
        labelStyle={{ color: "rgb(15,46,83)"}}
        label={this.state.modalButtonText}
        keyboardFocused={false}
        onClick={this.handleModalClose.bind(this)}
      />,
    ]

    return (
      <div>
        <Dialog
          title="Opening Your Account"
          actions={actions}
          modal={true}
          open={this.state.modalShown}
          onRequestClose={this.handleModalClose.bind(this)}
          paperClassName="modal-body"
          titleClassName="modal-title"
        >
          <CreateAccountStepper onComplete={this.setModalButtonText.bind(this)}/>
        </Dialog>

        <LoadingModal/>

        <div className="faded-image cash">
          <div className="hero">
            <div className="title">Welcome to the money revolution.</div>
            <div className="subtitle">
              Open your own <em><b>lifetime bank</b></em> today and reserve your payment address.
            </div>
          </div>
          <div className="flex-row-centered">
            <RaisedButton
              onClick={this.handleSignup.bind(this)}
              backgroundColor="rgb(244,176,4)"
              label="Get Started"
            />
          </div>
          <div className="container">
            <div className="columns">
              <div className="column">
                <div className="col-header">True Freedom</div>
                <div className="col-item">
                  <i className="material-icons">alarm_on</i>
                  Transaction settlement in seconds.
                </div>
                <div className="col-item">
                  <i className="material-icons">location_off</i>
                  Location independent.
                </div>
                <div className="col-item">
                  <i className="material-icons">language</i>
                  Global, permissionless transacting.
                </div>
              </div>
              <div className="column">
                <div className="col-header">Easy, Secure Transactions</div>
                <div className="col-item">
                  <i className="material-icons">fingerprint</i>
                  Security by design.
                </div>
                <div className="col-item">
                  <i className="material-icons">perm_contact_calendar</i>
                  Send to address book contacts.
                </div>
                <div className="col-item">
                  <i className="material-icons">email</i>
                  Email payment addresses.
                </div>
              </div>
              <div className="column">
                <div className="col-header">Fractional Cost</div>
                <div className="col-item">
                  <i className="material-icons">account_balance</i>
                  Account activation fee 0.50$.
                </div>
                <div className="col-item">
                  <i className="material-icons">settings_ethernet</i>
                  End-to-end transfer fee 0.99$.
                </div>
                <div className="col-item">
                  <i className="material-icons">replay</i>
                  Free recurring payments.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex-row-space-between">
            <div className="flex-row-column-50">
              <div className="p-l p-t">
                <div>
                  <Panel title="Transact" content={
                    <div>
                      <img src="/img/ledger.svg" width="120px" alt="Ledger"/>
                      <div className="title">
                        For full account functionality, authenticate with your Ledger device.
                      </div>
                      <div className="title-small p-t p-b">
                        Connect your Ledger Nano S device. Make sure Stellar
                        application is selected and browser support enabled.
                        For more information visit <a target="_blank" rel="noopener noreferrer"
                        href="https://support.ledgerwallet.com/hc/en-us/articles/115003797194">
                        Ledger Support</a>
                      </div>
                      <LedgerAuthenticator onConnected={this.logInViaLedger.bind(this)}/>
                    </div>
                  }/>
                </div>
              </div>
            </div>

            <div className="flex-row-column">
              <div className="p-t">
                <div>
                  <Panel title="Customize" content={
                    <div>
                      <img
                        style={{ marginBottom: '4px' }}
                        src="/img/sf.svg" width="140px" alt="Stellar Fox" />
                      <div className="title">
                        Manage your account with ease.
                      </div>
                      <div className="title-small p-t p-b">
                        Once you have opened your account you can log in here
                        to your banking terminal.
                      </div>
                      <div>
                        <div className="mui-text-input">
                          <div>
                            <TextInputField
                                type="email"
                                floatingLabelText="Email"
                                styles={styles}
                                validator={this.emailValidator.bind(this)}
                                action={this.compoundLoginValidator.bind(this)}
                                ref={(self) => { this.textInputFieldEmail = self }}
                            />
                          </div>
                          <div>
                            <TextInputField
                                type="password"
                                floatingLabelText="Password"
                                styles={styles}
                                validator={this.passwordValidator.bind(this)}
                                action={this.compoundLoginValidator.bind(this)}
                                ref={(self) => { this.textInputFieldPassword = self }}
                            />
                          </div>
                        </div>
                        <div className="flex-row-space-between">
                          <div>
                            <RaisedButton
                                onClick={this.compoundLoginValidator.bind(this)}
                                backgroundColor="rgb(244,176,4)"
                                label="Login"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  } />
                </div>
              </div>
            </div>

            <div className="flex-row-column">
              <div className="p-r p-t">
                <div>
                  <Panel title="Explore" content={
                    <div>
                      <img src="/img/stellar.svg" width="120px" alt="Stellar"/>
                      <div className="title">
                        To access global ledger explorer enter your <em>
                        Payment Address</em> or <em>Account Number</em>.
                      </div>
                      <div className="title-small p-t p-b">
                        Your account operations are publicly accessible on the global
                        ledger. Anyone who knows your account number or payment address
                        can view your public transactions.
                      </div>
                      <div className="title-small p-t p-b">
                        <strong>Please note that
                        this application will <u>never</u> ask you to
                        enter your Secret key.</strong>
                      </div>
                      <div className="mui-text-input">
                        <div>
<TextInputField
    floatingLabelText="Payment Address"
    styles={styles}
    validator={this.federationValidator.bind(this)}
    action={this.compoundFederationValidator.bind(this)}
    ref={(self) => { this.textInputFieldFederationAddress = self }}
/>

                        </div>
                        <div>
                          <RaisedButton
                            onClick={this.compoundFederationValidator.bind(this)}
                            backgroundColor="rgb(244,176,4)"
                            label="Check"
                          />
                        </div>
                      </div>
                    </div>
                  }/>
                </div>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountInfo: state.accountInfo,
    loadingModal: state.loadingModal,
    auth: state.auth,
    nav: state.nav,
    ui: state.ui,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    accountExistsOnLedger,
    accountMissingOnLedger,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    logInToHorizon,
    logOutOfHorizon,
    logIn,
    selectView,
    setHorizonEndPoint,
    setAccountRegistered,
    setAccountPath,
    setLedgerSoftwareVersion,
    setPublicKey,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Welcome)
