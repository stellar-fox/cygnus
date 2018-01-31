import React, {Component} from 'react'
import './Welcome.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import Input from '../frontend/input/Input'
import Checkbox from '../frontend/checkbox/Checkbox'
import Footer from './Footer'
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

  render() {
    return (
      <div>
        <MuiThemeProvider>
        <div>
          {this.props.loadingModal.loading ? (
            <div className="progress-modal">
              <div className="progress-spinner">
                <CircularProgress thickness={5} size={80} color='rgb(244,176,4)'/>
              </div>
              <div className="progress-message">
                {this.props.loadingModal.message}
              </div>
            </div>
          ) : null}
        </div>
        </MuiThemeProvider>

        <div className="faded-image cash">

          <div className="hero">
            <div className="title">Welcome to the money revolution.</div>
            <div className="subtitle">
              Open your own <em><b>lifetime bank</b></em> today and reserve your payment address.
            </div>
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
              <div className="p-r p-t">
                <div>
                  <Panel title="Explore" content={
                    <div>
                      <img src="/img/stellar.svg" width="120px" alt="Stellar"/>
                      <div className="title">
                        To access account explorer enter your Stellar <b>Public</b> Key
                      </div>
                      <div className="title-small p-t p-b">
                        Once the correct Public key is entered, the account
                        explorer will load automatically. Please note that
                        this application will <strong>never</strong> ask you to enter Secret key.
                      </div>
                      <MuiThemeProvider>
                        <div className="mui-text-input">
                          <TextField
                            onChange={this.publicKeyChanged.bind(this)}
                            floatingLabelText="Stellar Public Key"
                            errorText={this.props.accountInfo.message}
                            errorStyle={styles.errorStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            inputStyle={styles.inputStyle}
                          />
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
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Welcome)
