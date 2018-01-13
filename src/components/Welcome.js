import React, {Component} from 'react'
import './Welcome.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
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

  publicKeyChanged(event, value) {
    switch (true) {
      case value.length < 56:
        this.props.setPublicKeyInvalid({
          pubKey: value,
          message: ('Needs ' + (56-value.length) + ' characters.'),
        })
        break;
      case value.length === 56:
        try {
          // 1. validate public key
          window.StellarSdk.Keypair.fromPublicKey(value)
          this.props.setPublicKeyValid({
            pubKey: value,
            message: null,
          })
          sessionStorage.setItem('SFOX.ACCT_PUBKEY', value)

          // 2. show loading modal
          this.props.setModalLoading()

          // 3. load account info
          let that = this
          let server = new window.StellarSdk.Server('https://horizon.stellar.org')
          this.props.updateLoadingMessage({
            message: 'Searching for Account ...',
          })
          server.loadAccount(value)
            .catch(window.StellarSdk.NotFoundError, function (error) {
              throw new Error('The destination account does not exist!');
            })
            .then(function(account) {
              that.props.updateLoadingMessage({
                message: 'Account found. Loading account info ...',
              })
              that.props.accountExistsOnLedger({account}) // ===> THAT <=== !!!!
              sessionStorage.setItem('SFOX.ACCT_EXISTS', true)
              that.props.selectView('Balances')
              that.props.logIn()
              that.props.setModalLoaded()
              that.props.updateLoadingMessage({
                message: null,
              })
            }, function (e) {
              that.props.accountMissingOnLedger() // ===> THAT <=== !!!!
              sessionStorage.setItem('SFOX.ACCT_EXISTS', false)
              that.props.selectView('Balances')
              that.props.logIn()
              that.props.setModalLoaded()
              that.props.updateLoadingMessage({
                message: null,
              })
            })

        } catch (e) {
          this.props.setPublicKeyInvalid({
            pubKey: value,
            message: (e.message),
          })
        }
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

        <div className="container centered p-t-large">
          <div className="flex-centered">
            <Panel title="Transact" content={
              <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1916.3 516.8" className="svg">
                <g>
                  <path className="svg-logo-ledger" d="M578.2 392.7V24.3h25.6v344.1h175.3v24.3H578.2zm327.5 5.1c-39.7 0-70.4-12.8-93.4-37.1-21.7-24.3-33.3-58.8-33.3-103.6 0-43.5 10.2-79.3 32-104.9 21.7-26.9 49.9-39.7 87-39.7 32 0 57.6 11.5 76.8 33.3 19.2 23 28.1 53.7 28.1 92.1v20.5H804.6c0 37.1 9 66.5 26.9 85.7 16.6 20.5 42.2 29.4 74.2 29.4 15.3 0 29.4-1.3 40.9-3.8 11.5-2.6 26.9-6.4 44.8-14.1v24.3c-15.3 6.4-29.4 11.5-42.2 14.1-14.3 2.6-28.9 3.9-43.5 3.8zM898 135.6c-26.9 0-47.3 9-64 25.6-15.3 17.9-25.6 42.2-28.1 75.5h168.9c0-32-6.4-56.3-20.5-74.2-12.8-18-32-26.9-56.3-26.9zm238-21.8c19.2 0 37.1 3.8 51.2 10.2 14.1 7.7 26.9 19.2 38.4 37.1h1.3c-1.3-21.7-1.3-42.2-1.3-62.7V0h24.3v392.7h-16.6l-6.4-42.2c-20.5 30.7-51.2 47.3-89.6 47.3s-66.5-11.5-87-35.8c-20.5-23-29.4-57.6-29.4-102.3 0-47.3 10.2-83.2 29.4-108.7 19.2-25.6 48.6-37.2 85.7-37.2zm0 21.8c-29.4 0-52.4 10.2-67.8 32-15.3 20.5-23 51.2-23 92.1 0 78 30.7 116.4 90.8 116.4 30.7 0 53.7-9 67.8-26.9 14.1-17.9 21.7-47.3 21.7-89.6v-3.8c0-42.2-7.7-72.9-21.7-90.8-12.8-20.5-35.8-29.4-67.8-29.4zm379.9-16.6v17.9l-56.3 3.8c15.3 19.2 23 39.7 23 61.4 0 26.9-9 47.3-26.9 64-17.9 16.6-40.9 24.3-70.4 24.3-12.8 0-21.7 0-25.6-1.3-10.2 5.1-17.9 11.5-23 17.9-5.1 7.7-7.7 14.1-7.7 23s3.8 15.3 10.2 19.2c6.4 3.8 17.9 6.4 33.3 6.4h47.3c29.4 0 52.4 6.4 67.8 17.9s24.3 29.4 24.3 53.7c0 29.4-11.5 51.2-34.5 66.5-23 15.3-56.3 23-99.8 23-34.5 0-61.4-6.4-80.6-20.5-19.2-12.8-28.1-32-28.1-55 0-19.2 6.4-34.5 17.9-47.3s28.1-20.5 47.3-25.6c-7.7-3.8-15.3-9-19.2-15.3-5-6.2-7.7-13.8-7.7-21.7 0-17.9 11.5-34.5 34.5-48.6-15.3-6.4-28.1-16.6-37.1-30.7-9-14.1-12.8-30.7-12.8-48.6 0-26.9 9-49.9 25.6-66.5 17.9-16.6 40.9-24.3 70.4-24.3 17.9 0 32 1.3 42.2 5.1h85.7v1.3h.2zm-222.6 319.8c0 37.1 28.1 56.3 84.4 56.3 71.6 0 107.5-23 107.5-69.1 0-16.6-5.1-28.1-16.6-35.8-11.5-7.7-29.4-11.5-55-11.5h-44.8c-49.9 1.2-75.5 20.4-75.5 60.1zm21.8-235.4c0 21.7 6.4 37.1 19.2 49.9 12.8 11.5 29.4 17.9 51.2 17.9 23 0 40.9-6.4 52.4-17.9 12.8-11.5 17.9-28.1 17.9-49.9 0-23-6.4-40.9-19.2-52.4-12.8-11.5-29.4-17.9-52.4-17.9-21.7 0-39.7 6.4-51.2 19.2-12.8 11.4-17.9 29.3-17.9 51.1z"/>
                  <path className="svg-logo-ledger" d="M1640 397.8c-39.7 0-70.4-12.8-93.4-37.1-21.7-24.3-33.3-58.8-33.3-103.6 0-43.5 10.2-79.3 32-104.9 21.7-26.9 49.9-39.7 87-39.7 32 0 57.6 11.5 76.8 33.3 19.2 23 28.1 53.7 28.1 92.1v20.5h-197c0 37.1 9 66.5 26.9 85.7 16.6 20.5 42.2 29.4 74.2 29.4 15.3 0 29.4-1.3 40.9-3.8 11.5-2.6 26.9-6.4 44.8-14.1v24.3c-15.3 6.4-29.4 11.5-42.2 14.1-14.1 2.6-28.2 3.8-44.8 3.8zm-6.4-262.2c-26.9 0-47.3 9-64 25.6-15.3 17.9-25.6 42.2-28.1 75.5h168.9c0-32-6.4-56.3-20.5-74.2-12.8-18-32-26.9-56.3-26.9zm245.6-21.8c11.5 0 24.3 1.3 37.1 3.8l-5.1 24.3c-11.8-2.6-23.8-3.9-35.8-3.8-23 0-42.2 10.2-57.6 29.4-15.3 20.5-23 44.8-23 75.5v149.7h-25.6V119h21.7l2.6 49.9h1.3c11.5-20.5 23-34.5 35.8-42.2 15.4-9 30.7-12.9 48.6-12.9zM333.9 12.8h-183v245.6h245.6V76.7c.1-34.5-28.1-63.9-62.6-63.9zm-239.2 0H64c-34.5 0-64 28.1-64 64v30.7h94.7V12.8zM0 165h94.7v94.7H0V165zm301.9 245.6h30.7c34.5 0 64-28.1 64-64V316h-94.7v94.6zm-151-94.6h94.7v94.7h-94.7V316zM0 316v30.7c0 34.5 28.1 64 64 64h30.7V316H0z"/>
                </g>
              </svg>
              <div className="title">
                For full account functionality, authenticate with your hardware wallet.
              </div>
              <div className="title-small p-t">
                Simply connect your Ledger Nano S hardware wallet. Make sure Stellar
                wallet is selected and browser support enabled.
              </div>
              </div>
            }/>
          </div>
        </div>

        <div className="container centered p-t-large">
          <div className="flex-centered">
            <Panel title="Explore" content={
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92.890235 24.494523" className="svg">
                  <g transform="translate(69.615056,-140.32149)">
                    <g transform="matrix(0.35277777,0,0,-0.35277777,-70.548786,163.69422)">
                      <g>
                        <g>
                          <g transform="translate(42.2798,23.6577)">
                            <path className="svg-logo-stellar"
                               d="m 0,0 c 0,-3.099 -0.782,-5.751 -2.347,-7.956 -1.564,-2.205 -3.784,-3.888 -6.659,-5.05 -2.875,-1.162 -6.161,-1.743 -9.855,-1.743 -9.803,0 -16.477,2.727 -20.022,8.179 l 8.581,6.033 c 1.4,-1.906 3.017,-3.18 4.849,-3.82 1.832,-0.642 3.791,-0.961 5.877,-0.961 5.482,0 8.224,1.593 8.224,4.781 0,1.401 -0.775,2.481 -2.324,3.241 -1.55,0.76 -3.978,1.542 -7.285,2.346 -6.228,1.37 -10.608,3.307 -13.14,5.81 -2.533,2.503 -3.799,5.75 -3.799,9.744 0,4.141 1.587,7.553 4.76,10.234 3.173,2.682 7.844,4.022 14.011,4.022 4.201,0 7.903,-0.67 11.107,-2.011 3.202,-1.341 5.668,-3.351 7.396,-6.033 l -8.625,-6.123 c -2.057,3.158 -5.409,4.737 -10.057,4.737 -2.384,0 -4.186,-0.409 -5.407,-1.229 -1.222,-0.82 -1.833,-1.87 -1.833,-3.151 0,-1.222 0.551,-2.197 1.654,-2.927 1.102,-0.73 3.277,-1.497 6.525,-2.302 5.333,-1.311 9.14,-2.614 11.419,-3.91 2.28,-1.296 4.007,-2.906 5.184,-4.827 C -0.589,5.162 0,2.8 0,0" />
                          </g>
                          <g transform="translate(77.3638,10.2944)">
                            <path className="svg-logo-stellar"
                               d="m 0,0 c -3.099,-0.923 -6.362,-1.385 -9.788,-1.385 -5.423,0 -9.326,1.221 -11.709,3.664 -2.384,2.443 -3.576,6.406 -3.576,11.888 v 23.554 h -5.944 v 9.162 h 5.944 v 13.051 h 11.531 V 46.883 H -2.637 V 37.721 H -13.542 V 15.643 c 0,-2.921 0.454,-4.902 1.363,-5.945 0.909,-1.043 2.197,-1.564 3.866,-1.564 2.115,0 4.216,0.432 6.302,1.296 z" />
                          </g>
                          <g transform="translate(112.8057,38.6743)">
                            <path className="svg-logo-stellar"
                               d="m 0,0 c 0,7.121 -3.114,10.682 -9.341,10.682 -2.056,0 -3.74,-0.351 -5.051,-1.051 -1.311,-0.7 -2.361,-1.742 -3.15,-3.128 C -18.332,5.118 -18.95,2.95 -19.397,0 Z m -19.71,-7.955 c 0.208,-4.172 1.222,-7.167 3.039,-8.983 1.817,-1.818 4.678,-2.727 8.581,-2.727 2.264,0 4.253,0.283 5.967,0.85 1.713,0.565 3.21,1.653 4.492,3.262 l 8.581,-6.123 c -1.878,-2.712 -4.313,-4.738 -7.308,-6.078 -2.994,-1.341 -7.083,-2.011 -12.268,-2.011 -7.717,0 -13.475,2.025 -17.274,6.078 -3.799,4.052 -5.698,10.174 -5.698,18.369 0,16.774 7.508,25.162 22.525,25.162 6.674,0 11.761,-1.885 15.263,-5.654 3.5,-3.769 5.251,-9.259 5.251,-16.469 v -5.676 z" />
                          </g>
                          <path className="svg-logo-stellar"
                             d="m 134.66,76.842 h 11.531 V 10.294 H 134.66 Z" />
                          <path className="svg-logo-stellar"
                             d="m 159.197,76.842 h 11.531 V 10.294 h -11.531 z" />
                          <g transform="translate(210.4595,32.0601)">
                            <path className="svg-logo-stellar"
                               d="m 0,0 -5.855,-0.537 c -4.142,-0.357 -7.128,-1.147 -8.961,-2.368 -1.832,-1.222 -2.748,-3.054 -2.748,-5.497 0,-2.146 0.595,-3.614 1.787,-4.403 1.192,-0.789 2.771,-1.184 4.738,-1.184 1.4,0 3.106,0.439 5.117,1.319 2.011,0.878 3.985,2.122 5.922,3.731 z m 0.938,-21.766 v 4.872 c -4.558,-4.172 -9.445,-6.257 -14.659,-6.257 -5.184,0 -9.103,1.363 -11.754,4.089 -2.652,2.727 -3.978,6.22 -3.978,10.481 0,3.336 0.678,6.093 2.034,8.268 1.355,2.175 3.366,3.881 6.033,5.117 2.666,1.237 6.503,2.108 11.509,2.615 L 0,8.357 v 2.101 c 0,2.622 -0.79,4.417 -2.369,5.386 -1.579,0.968 -3.888,1.452 -6.927,1.452 -2.503,0 -4.656,-0.418 -6.458,-1.251 -1.804,-0.835 -3.137,-2.027 -4,-3.576 l -8.984,5.766 c 1.579,2.651 4.052,4.685 7.419,6.1 3.367,1.415 7.434,2.123 12.201,2.123 7.3,0 12.566,-1.273 15.8,-3.821 3.232,-2.548 4.849,-6.726 4.849,-12.536 v -31.867 z" />
                          </g>
                          <g transform="translate(262.9287,45.9146)">
                            <path className="svg-logo-stellar"
                               d="m 0,0 c -1.192,0.596 -2.771,0.894 -4.737,0.894 -2.145,0 -4.179,-0.514 -6.101,-1.542 -1.922,-1.028 -3.896,-2.525 -5.922,-4.492 V -35.62 H -28.291 V 11.263 H -16.76 V 4.559 c 1.967,2.145 4.082,3.918 6.347,5.318 2.264,1.4 4.796,2.101 7.598,2.101 2.383,0 4.081,-0.313 5.094,-0.938 z" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <div className="title">
                  To access account explorer enter your Stellar <b>Public</b> Key
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
    )
  }
}

function mapStateToProps(state) {
  return {
    progressMessage: state.progressMessage,

    accountInfo: state.accountInfo,
    loadingModal: state.loadingModal,
    auth: state.auth,
    nav: state.nav,
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
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Welcome)
