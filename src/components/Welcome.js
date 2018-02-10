import React, {Component} from 'react'
import './Welcome.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Input from '../frontend/input/Input'
import Checkbox from '../frontend/checkbox/Checkbox'
import Footer from './Footer'
import LoadingModal from './LoadingModal'
import Dialog from 'material-ui/Dialog'
import {emailValid, pubKeyValid, federationAddressValid, federationLookup} from '../lib/utils'
import CreateAccountStepper from './CreateAccount/CreateAccount'
import {config} from '../config'
import axios from 'axios'
import {
  setPublicKeyValid,
  setPublicKeyInvalid,
  accountExistsOnLedger,
  accountMissingOnLedger,
  setModalLoading,
  setModalLoaded,
  updateLoadingMessage,
  logInToHorizon,
  logOutOfHorizon,
  logIn,
  selectView,
  disableAuthenticateButton,
  enableAuthenticateButton,
  setHorizonEndPoint,
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
      ledgerSupported: false,
      explorerInputValue: '',
      explorerInputIsValid: true,
      explorerInputMessage: '',
      explorerInputMessageToDisplay: '',
      modalShown: false,
      modalButtonText: 'CANCEL',
    }
  }


  // ...
  componentDidMount(){
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
      this.setState({
        ledgerSupported: true
      })
    }
    this.props.setInvalidInputMessage({
      textFieldEmail: null
    })
    this.props.setInvalidInputMessage({
      textFieldPassword: null
    })
    /*
    * Horizon end point is set to testnet by default.
    */
    this.props.setHorizonEndPoint(config.horizon)
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


  // ...
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


  // ...
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


  // ...
  handleOnClickAuthenticate() {
    this.props.disableAuthenticateButton()
    this.logInViaLedger()
  }


  // ...
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


  // ...
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
          this.props.logInToHorizon({isReadOnly})
          this.props.setModalLoaded()
          this.props.updateLoadingMessage({
            message: null,
          })
        }, (e) => {
          this.props.accountMissingOnLedger()
          this.props.selectView('Balances')
          this.props.logInToHorizon({isReadOnly})
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


  // ...
  federationAddressChanged(event, value) {
    let pubKeyCheck = pubKeyValid(value)
    let fedAddrIsValid = federationAddressValid(value)
    
    this.setState({
      explorerInputValue: value,
    })

    switch (true) {
      // Valid Stellar PublicKey
      case pubKeyCheck.valid:
        this.setState({
          explorerInputIsValid: true,
          explorerInputMessage: null,
        })
        break;
      // Valid Federation Address
      case fedAddrIsValid:
        this.setState({
          explorerInputIsValid: true,
          explorerInputMessage: null,
        })
        break;
      // // Invalid Stellar Public Key
      case !pubKeyCheck.valid:
        this.setState({
          explorerInputIsValid: false,
          explorerInputMessage: pubKeyCheck.message
        })
        break;
      // 0 Length Input
      case value.length === 0:
        this.setState({
          explorerInputIsValid: true,
          explorerInputMessage: null,
        })
        break;
      default:
        break;
    }

    // Looks like user is entering Federation Address format.
    if (value.match(/\*/) && !fedAddrIsValid) {
      this.setState({
        explorerInputIsValid: false,
        explorerInputMessage: 'Invalid Federation Address'
      })
    }

    if (!value.match(/^G/) && !value.match(/\*/)) {
      this.setState({
        explorerInputIsValid: false,
        explorerInputMessage: 'Invalid Input'
      })
    }
  }


  // ...
  handleOnClickCheck() {
    this.setState({
      explorerInputMessageToDisplay: this.state.explorerInputMessage,
    })
    // Input entered is a valid Federation Address
    if (federationAddressValid(this.state.explorerInputValue)) {
      this.props.setModalLoading()
      this.props.updateLoadingMessage({message: "Looking up federation endpoint ..."})
      this.setState({
        explorerInputMessageToDisplay: null,
      })
      federationLookup(this.state.explorerInputValue)
      .then((federationEndpointObj) => {
        if (federationEndpointObj.ok) {
          axios.get(`${federationEndpointObj.endpoint}?q=${this.state.explorerInputValue}&type=name`)
            .then((response) => {
              this.logInViaPublicKey(response.data.account_id)
            })
            .catch((error) => {
              this.props.setModalLoaded()
              if (error.response.data.detail) {
                this.setState({
                  explorerInputMessageToDisplay: error.response.data.detail,
                })
              } else {
                this.setState({
                  explorerInputMessageToDisplay: error.response.data.message,
                })
              }
            });
        } else {
          this.props.setModalLoaded()
          this.setState({
            explorerInputMessageToDisplay: federationEndpointObj.error,
          })
        }
      })
    }
    // Input entered is a valid Stellar PublicKey
    if (pubKeyValid(this.state.explorerInputValue).valid) {
      this.logInViaPublicKey(this.state.explorerInputValue)
    }
  }


  // ...
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


  // ...
  handleOnClickLogin() {
    if (emailValid(this.state.textFieldEmail)) {
      this.props.setInvalidInputMessage({
        textFieldEmail: null
      })
      this.props.setInvalidInputMessage({
        textFieldPassword: null
      })
      axios.post(`${config.api}/user/authenticate/${this.state.textFieldEmail}/${this.textInput.input.value}`)
        .then((response) => {
          this.props.logIn({
            userId: response.data.user_id,
            token: response.data.token,
          })
          this.logInViaPublicKey(response.data.pubkey)
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.props.setInvalidInputMessage({
              textFieldEmail: 'Possibly Incorrect Email'
            })
            this.props.setInvalidInputMessage({
              textFieldPassword: 'Possibly Incorrect Password'
            })
          } else {
            this.props.setInvalidInputMessage({
              textFieldEmail: null
            })
            this.props.setInvalidInputMessage({
              textFieldPassword: null
            })
            console.log(error.response.statusText)
          }
        })
    } else {
      this.props.setInvalidInputMessage({
        textFieldEmail: 'Invalid email format.'
      })
    }
  }


  // ...
  handleSignup() {
    this.setState({
      modalButtonText: 'CANCEL',
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
                        For full account functionality, authenticate with your hardware key.
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
                        <RaisedButton
                          onClick={this.handleOnClickAuthenticate.bind(this)}
                          disabled={this.props.ui.authenticateButton.isDisabled}
                          backgroundColor="rgb(244,176,4)"
                          label="Authenticate"
                        />
                        {this.state.ledgerSupported ? null : 
                          (
                            <div className="title-small p-t">
                              This browser doesn’t support the FIDO U2F standard yet.
                              We recommend updating to the latest <a target="_blank"
                              rel="noopener noreferrer" href="https://www.google.com/chrome/">
                              Google Chrome</a> in order to use your Ledger device.
                            </div>
                          )
                        }
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
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  this.handleOnClickLogin.call(this)
                                }
                              }}
                            />
                          </div>
                          <div>
                            <TextField
                              type="password"
                              floatingLabelText="Password"
                              errorStyle={styles.errorStyle}
                              errorText={this.props.ui.messages.textFieldPassword}
                              underlineStyle={styles.underlineStyle}
                              underlineFocusStyle={styles.underlineStyle}
                              floatingLabelStyle={styles.floatingLabelStyle}
                              floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                              inputStyle={styles.inputStyle}
                              ref={(input) => { this.textInput = input; }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  this.handleOnClickLogin.call(this)
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-row-space-between">
                          <div>
                            <RaisedButton
                              onClick={this.handleOnClickLogin.bind(this)}
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
                          <TextField
                            onChange={this.federationAddressChanged.bind(this)}
                            floatingLabelText="Payment Address"
                            errorText={this.state.explorerInputMessageToDisplay}
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
                        </div>
                        <div>
                          <RaisedButton
                            onClick={this.handleOnClickCheck.bind(this)}
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
    setPublicKeyValid,
    setPublicKeyInvalid,
    accountExistsOnLedger,
    accountMissingOnLedger,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
    logInToHorizon,
    logOutOfHorizon,
    logIn,
    selectView,
    disableAuthenticateButton,
    enableAuthenticateButton,
    setHorizonEndPoint,
    setInvalidInputMessage,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Welcome)
