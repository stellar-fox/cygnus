import React, {Component} from 'react'
import './Welcome.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Input from '../frontend/input/Input'
import Checkbox from '../frontend/checkbox/Checkbox'
import Footer from './Footer'
import LoadingModal from './LoadingModal'
import {emailValid, federationAddressValid, federationLookup} from '../lib/utils'
import axios from 'axios'
import {
  setPublicKeyValid,
  setPublicKeyInvalid,
  accountExistsOnLedger,
  accountMissingOnLedger,
  setModalLoading,
  setModalLoaded,
  updateLoadingMessage,
  logIn,
  logOut,
  selectView,
  disableAuthenticateButton,
  enableAuthenticateButton,
  setHorizonEndPoint,
  setCurrencyPrecision,
  setInvalidInputMessage,
} from '../actions/index'
import Panel from './Panel'

const styles = {
  errorStyle: {
    color: '#912d35',
  },
  underlineStyle: {
    borderColor: '#FFC107',
  },
  floatingLabelStyle: {
    color: 'rgba(212,228,188,0.4)',
  },
  floatingLabelFocusStyle: {
    color: 'rgba(212,228,188,0.2)',
  },
  inputStyle: {
    color: 'rgb(244,176,4)',
  },
}

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      derivationPath: '0',
      derivationPrefix: "44'/148'/",
      pathEditable: false,
      useDefaultAccount: true,
      textFieldEmail: '',
      textFieldFederationAddress: '',
    }
  }

  componentDidMount(){
    /*
    * Horizon end point is set to testnet by default.
    */
    this.props.setHorizonEndPoint('https://horizon-testnet.stellar.org')
    this.props.setCurrencyPrecision('2')
    this.props.disableAuthenticateButton()
    let that = this
    new window.StellarLedger.Api(new window.StellarLedger.comm(Number.MAX_VALUE)).connect(
      function() {
        console.log('Ledger Nano S is now connected.')
        that.props.enableAuthenticateButton()
      },
      function(err) {
        console.error(err)
      }
    )
  }

  handleCheckboxClick(event) {
    const target = event.target
    this.setState({
      useDefaultAccount: target.checked
    })
    this.setState((prevState) => ({
      pathEditable: !target.checked
    }))
    // reset derivation path index to 0
    if(target.checked) {
      this.setState((prevState) => ({
        derivationPath: '0',
        derivationPathIndex: 0
      }))
    }
  }

  handlePathChange(event) {
    const target = event.target
    if (isNaN(target.value)) {
      return false
    }
    const index = parseInt(target.value, 10)
    this.setState({
      derivationPath: target.value,
      derivationPathIndex: index
    })
  }

  handleOnClickAuthenticate() {
    this.props.disableAuthenticateButton()
    this.logInViaLedger()
  }

  logInViaLedger() {
    let that = this
    let bip32Path = "44'/148'/" + this.state.derivationPath + "'";
    window.StellarLedger.comm.create_async().then(function(comm) {
      let api = new window.StellarLedger.Api(comm)
      return api.getPublicKey_async(bip32Path).then(function (result) {
        let publicKey = result['publicKey']
        that.logInViaPublicKey(publicKey, false)
      }).catch(function (err) {
          console.error(err)
      })
    })
  }

  logInViaPublicKey(pubKey, isReadOnly=true) {
    try {
      // 1. validate public key
      window.StellarSdk.Keypair.fromPublicKey(pubKey)
      this.props.setPublicKeyValid({
        pubKey: pubKey,
        message: null,
      })

      // 2. show loading modal
      this.props.setModalLoading()

      // 3. load account info
      let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
      this.props.updateLoadingMessage({
        message: 'Searching for Account ...',
      })
      server.loadAccount(pubKey)
        .catch(window.StellarSdk.NotFoundError, function (error) {
          throw new Error('The destination account does not exist!');
        })
        .then((account) => {
          this.props.accountExistsOnLedger({account})
          this.props.selectView('Balances')
          this.props.logIn({isReadOnly})
          this.props.setModalLoaded()
          this.props.updateLoadingMessage({
            message: null,
          })
        }, (e) => {
          this.props.accountMissingOnLedger()
          this.props.selectView('Balances')
          this.props.logIn({isReadOnly})
          this.props.setModalLoaded()
          this.props.updateLoadingMessage({
            message: null,
          })
        })

    } catch (e) {
      this.props.setPublicKeyInvalid({
        pubKey: pubKey,
        message: (e.message),
      })
    }
  }

  publicKeyChanged(event, value) {
    switch (true) {
      case value.length < 56:
        this.props.setInvalidInputMessage({
          textFieldPublicKey: ('Needs ' + (56-value.length) + ' characters.')
        })
        this.props.setPublicKeyInvalid({
          pubKey: value,
          message: ('Needs ' + (56-value.length) + ' characters.'),
        })
        break;
      case value.length === 56:
        this.logInViaPublicKey(value)
        break;
      default:
        break;
    }
  }

  federationAddressChanged(event, value) {
    this.setState({
      textFieldFederationAddress: value
    })
    return federationAddressValid(value) ? (
      this.props.setInvalidInputMessage({
        textFieldFederationAddress: null
      })
    ) : null
  }

  handleOnClickCheck() {
    if (federationAddressValid(this.state.textFieldFederationAddress)) {
      this.props.setModalLoading()
      this.props.updateLoadingMessage({message: "Looking up federation endpoint ..."})
      this.props.setInvalidInputMessage({
        textFieldFederationAddress: null
      })

      federationLookup(this.state.textFieldFederationAddress)
        .then((federationEndpointObj) => {
          if (federationEndpointObj.ok) {
            axios.get(`${federationEndpointObj.endpoint}?q=${this.state.textFieldFederationAddress}&type=name`)
              .then((response) => {
                this.logInViaPublicKey(response.data.account_id)
              })
              .catch((error) => {
                this.props.setModalLoaded()
                if (error.response && error.response.data) {
                  this.props.setInvalidInputMessage({
                    textFieldFederationAddress: error.response.data.detail
                  })
                } else {
                  this.props.setInvalidInputMessage({
                    textFieldFederationAddress: error.message
                  })
                }
              });
          } else {
            this.props.setModalLoaded()
            this.props.setInvalidInputMessage({
              textFieldFederationAddress: federationEndpointObj.error
            })
          }
        })
    } else {
      this.props.setInvalidInputMessage({
        textFieldFederationAddress: 'Invalid address format.'
      })
    }
  }

  emailChanged(event, value) {
    this.setState({
      textFieldEmail: value
    })
    return emailValid(value) ? (
      this.props.setInvalidInputMessage({
        textFieldEmail: null
      })
    ) : null
  }

  handleOnClickLogin() {
    if (emailValid(this.state.textFieldEmail)) {
      this.props.setInvalidInputMessage({
        textFieldEmail: null
      })
    } else {
      this.props.setInvalidInputMessage({
        textFieldEmail: 'Invalid email format.'
      })
    }
  }

  handleSignup() {
    console.log('signup')
    return false
  }

  render() {
    return (
      <div>
        <LoadingModal/>

        <div className="faded-image cash">

          <div className="hero">
            <div className="title">Welcome to the money revolution.</div>
            <div className="subtitle">
              Open your own <em><b>lifetime bank</b></em> today and reserve your payment address.
            </div>
          </div>

          <div className="flex-row-centered">
            <MuiThemeProvider>
              <RaisedButton
                onClick={this.handleSignup.bind(this)}
                backgroundColor="rgb(244,176,4)"
                label="Get Started"
              />
            </MuiThemeProvider>
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
                        For full account functionality, authenticate with your hardware wallet.
                      </div>
                      <div className="title-small p-t p-b">
                        Connect your Ledger Nano S hardware wallet. Make sure Stellar
                        application is selected and browser support enabled.
                        For more information visit <a target="_blank" rel="noopener noreferrer"
                        href="https://support.ledgerwallet.com/hc/en-us/articles/115003797194">
                        Ledger Support</a>
                      </div>
                      <div className='p-b p-t'>
                        <Checkbox
                          isChecked={this.state.useDefaultAccount}
                          handleChange={this.handleCheckboxClick.bind(this)}
                          label='Use Default Account' />
                      </div>
                      {this.state.pathEditable ?
                      <div className="p-b p-t flex-start">
                      <Input
                        label="Account Index"
                        inputType="text"
                        maxLength="100"
                        autoComplete="off"
                        value={this.state.derivationPath}
                        handleChange={this.handlePathChange.bind(this)}
                        subLabel={
                          "Account Derivation Path: [" + this.state.derivationPrefix +
                          this.state.derivationPath + "']"
                        }/></div> : null }
                      <MuiThemeProvider>
                        <RaisedButton
                          onClick={this.handleOnClickAuthenticate.bind(this)}
                          disabled={this.props.ui.authenticateButton.isDisabled}
                          backgroundColor="rgb(244,176,4)"
                          label="Authenticate"
                        />
                      </MuiThemeProvider>
                    </div>
                  }/>
                </div>
              </div>
            </div>
            <div className="flex-row-column">
              <div className="p-t">
                <div>
                  <Panel title="Explore" content={
                    <div>
                      <img src="/img/stellar.svg" width="120px" alt="Stellar"/>
                      <div className="title">
                        To access account explorer enter your Stellar <b>Public</b> Key
                        or <em>Stellar Federation Address</em>.
                      </div>
                      <div className="title-small p-t p-b">
                        Once the correct Public key is entered, the account
                        explorer will load automatically. <strong>Please note that
                        this application will <u>never</u> ask you to
                        enter your Secret key.</strong>
                      </div>
                      <MuiThemeProvider>
                        <div className="mui-text-input">
                          <TextField
                            onChange={this.publicKeyChanged.bind(this)}
                            floatingLabelText="Stellar Public Key"
                            errorText={this.props.ui.messages.textFieldPublicKey}
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            inputStyle={styles.inputStyle}
                          />
                          <TextField
                            onChange={this.federationAddressChanged.bind(this)}
                            floatingLabelText="Federation Address"
                            errorText={this.props.ui.messages.textFieldFederationAddress}
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            inputStyle={styles.inputStyle}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                this.handleOnClickCheck.call(this)
                              }
                            }}
                          />
                          <div>
                            <RaisedButton
                              onClick={this.handleOnClickCheck.bind(this)}
                              backgroundColor="rgb(244,176,4)"
                              label="Check"
                            />
                          </div>
                        </div>
                      </MuiThemeProvider>
                    </div>
                  }/>
                </div>
              </div>
            </div>
            <div className="flex-row-column">
              <div className="p-r p-t">
                <div>
                  <Panel title="Customize" content={
                    <div>
                      <img
                        style={{marginBottom: '4px'}}
                        src="/img/sf.svg" width="140px" alt="Stellar Fox"/>
                      <div className="title">
                        Configure your account settings via our backend API.
                      </div>
                      <div className="title-small p-t p-b">
                        Sign-in to your online banking terminal. The account
                        will let you customize your settings and manage your
                        contacts.
                      </div>
                      <MuiThemeProvider>
                      <div>
                        <div className="mui-text-input">
                          <TextField
                            type="email"
                            onChange={this.emailChanged.bind(this)}
                            floatingLabelText="Email"
                            errorText={this.props.ui.messages.textFieldEmail}
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            inputStyle={styles.inputStyle}
                          />
                          <TextField
                            type="password"
                            floatingLabelText="Password"
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            inputStyle={styles.inputStyle}
                          />
                        </div>
                        <div className="flex-row-space-between">
                          <div>
                            <RaisedButton
                              onClick={this.handleOnClickLogin.bind(this)}
                              backgroundColor="rgb(244,176,4)"
                              label="Login"
                            />
                          </div>
                          <div className="small">
                            <div>No account yet?</div>
                            <div>
                              <div className="link" onClick={this.handleSignup.bind(this)}>
                                Signup
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </MuiThemeProvider>
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
    setPublicKeyValid,
    setPublicKeyInvalid,
    accountExistsOnLedger,
    accountMissingOnLedger,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    logIn,
    logOut,
    selectView,
    disableAuthenticateButton,
    enableAuthenticateButton,
    setHorizonEndPoint,
    setCurrencyPrecision,
    setInvalidInputMessage,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Welcome)
