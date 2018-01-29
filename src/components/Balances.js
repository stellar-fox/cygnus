import React, {Component} from 'react'
import './Balances.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import SnackBar from '../frontend/snackbar/SnackBar'
import axios from 'axios'
import {formatAmount} from '../lib/utils'
import {
  setExchangeRate,
  showAlert,
  hideAlert,
  setCurrency,
  setStreamer,
  accountExistsOnLedger,
} from '../actions/index'

class Balances extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sbPayment: false,
      sbPaymentAmount: null,
      sbPaymentAssetCode: null,
    }
  }

  componentDidMount() {
    this.getExchangeRate(this.props.currency.default)
    this.props.setStreamer(this.paymentsStreamer.call(this))
  }

  componentWillUnmount() {
    this.props.accountInfo.streamer.call(this)
  }

  paymentsStreamer() {
    let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
    return server.payments()
      .cursor('now')
      .stream({
        onmessage: (message) => {
          /*
          * Initial Account Funding
          */
          if (message.type === 'create_account' && message.account === this.props.accountInfo.pubKey) {
            this.updateAccount.call(this)
            this.setState({
              sbPayment: true,
              sbPaymentText: 'Account Funded: ',
              sbPaymentAmount: formatAmount(
                message.starting_balance, this.props.accountInfo.precision),
              sbPaymentAssetCode: 'XLM'
            })
          }

          /*
          * Receiving Payment
          */
          if (message.type === 'payment' && message.to === this.props.accountInfo.pubKey) {
            this.updateAccount.call(this)
            this.setState({
              sbPayment: true,
              sbPaymentText: 'Payment Received: ',
              sbPaymentAmount: formatAmount(
                message.amount, this.props.accountInfo.precision),
              sbPaymentAssetCode: (
                message.asset_type === 'native' ? 'XLM' : message.asset_code)
            })
          }

          /*
          * Sending Payment
          */
          if (message.type === 'payment' && message.from === this.props.accountInfo.pubKey) {
            this.updateAccount.call(this)
            this.setState({
              sbPayment: true,
              sbPaymentText: 'Payment Sent: ',
              sbPaymentAmount: formatAmount(
                message.amount, this.props.accountInfo.precision),
              sbPaymentAssetCode: (
                message.asset_type === 'native' ? 'XLM' : message.asset_code)
            })
          }

        }
      })
  }

  updateAccount() {
    let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
    server.loadAccount(this.props.accountInfo.pubKey)
      .catch(window.StellarSdk.NotFoundError, function (error) {
        throw new Error('The destination account does not exist!');
      })
      .then((account) => {
        this.props.accountExistsOnLedger({account})
      }, (e) => {
        this.props.accountMissingOnLedger()
      })
  }

  getNativeBalance(account) {
    let nativeBalance = 0
    account.balances.forEach((balance) => {
      if (balance.asset_type === 'native') {
        nativeBalance = balance.balance
      }
    })
    return nativeBalance
  }

  exchangeRateFetched() {
    if (
      this.props.accountInfo.rates !== undefined &&
      this.props.accountInfo.rates[this.props.currency.default] !== undefined
    ) {
      return true
    }
    return false
  }

  exchangeRateStale() {
    if (
      this.props.accountInfo.rates === undefined ||
      this.props.accountInfo.rates[this.props.currency.default] === undefined ||
      this.props.accountInfo.rates[this.props.currency.default].lastFetch + 300000 < Date.now()
    ) {
      return true
    }
    return false
  }

  getExchangeRate(currency) {
    const cryptonatorXlmTicker = 'https://api.cryptonator.com/api/ticker/xlm-'
    if (this.exchangeRateStale()) {
      axios.get(cryptonatorXlmTicker + currency)
        .then((response) => {
          if (response.data.success === true) {
            this.props.setExchangeRate({[currency]: {
              rate: response.data.ticker.price,
              lastFetch: Date.now()
            }})
          } else {
            console.log(`Cryptonator: ${response.data.error}`)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  getOtherBalances(account) {
    return account.balances.map((balance) => {
      if (balance.asset_type !== 'native') {
        return (
          <p className='other-assets' key={balance.asset_code}>
            <span className='other-asset-balance'>
              {
                Number.parseFloat(balance.balance)
                  .toFixed(this.props.accountInfo.precision)
              }
            </span>
            <span className='other-asset-code'>
              {balance.asset_code}
            </span>
          </p>
        )
      }
      return undefined
    })
  }

  handleOpen = () => {
    this.props.showAlert()
  }

  handleClose = () => {
    this.props.hideAlert()
  }

  handlePaymentSnackBarClose = () => {
    this.setState({
      sbPayment: false
    })
  }

  render() {
    let otherBalances
    if (this.props.accountInfo.exists) {
      otherBalances = this.getOtherBalances.call(
        this, this.props.accountInfo.account.account
      )
    }

    const actions = [
      <RaisedButton
        backgroundColor="rgb(15,46,83)"
        labelColor="rgb(244,176,4)"
        label="OK"
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ]

    return (

      <div>
        <MuiThemeProvider>
          <div>
            <SnackBar
              open={this.state.sbPayment}
              message={`${this.state.sbPaymentText} ${this.state.sbPaymentAmount} ${this.state.sbPaymentAssetCode}`}
              onRequestClose={this.handlePaymentSnackBarClose.bind(this)}
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
          </div>
        </MuiThemeProvider>
        {this.props.accountInfo.exists ? (
          <div>
            <MuiThemeProvider>
              <Card className='account'>
                <CardHeader
                  title={
                    <span>
                      <span>Current Balance </span>
                      <i className="material-icons">hearing</i>
                    </span>
                  }
                  subtitle="Stellar Lumens"
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText>
                  <div className='flex-row'>
                    <div>
                      <div className='balance'>
                        {Number.parseFloat(this.getNativeBalance.call(
                          this, this.props.accountInfo.account.account
                        )).toFixed(this.props.accountInfo.precision)} XLM
                      </div>
                      <div>
                        {this.exchangeRateFetched() ?
                          (Number.parseFloat(this.getNativeBalance.call(
                            this, this.props.accountInfo.account.account
                          )) * Number.parseFloat(
                            this.props.accountInfo.rates[this.props.currency.default].rate)
                          ).toFixed(2) : '0.00'
                        } {this.props.currency.default.toUpperCase()}
                      </div>
                    </div>
                    <div></div>
                  </div>

                </CardText>
                <CardActions>
                  <RaisedButton
                    backgroundColor="rgb(15,46,83)"
                    labelColor="rgb(244,176,4)"
                    label="Deposit"
                    onClick={this.handleOpen.bind(this)}
                  />
                  {this.props.auth.isReadOnly ? null :
                    <RaisedButton
                      backgroundColor="rgb(15,46,83)"
                      labelColor="rgb(244,176,4)"
                      label="Send"
                      onClick={this.handleOpen.bind(this)}
                    />
                  }
                </CardActions>
                <CardText expandable={true}>
                  <div>
                    <div>Other Assets</div>
                    <div>
                      {otherBalances[0] !== undefined ?
                        otherBalances : <div className='faded'>
                          You currently do not own any other assets.
                        </div>
                      }
                    </div>
                  </div>
                </CardText>
              </Card>
            </MuiThemeProvider>
          </div>
        ) : (
          <MuiThemeProvider>
            <Card className='account'>
              <CardHeader
                title="Current Balance"
                subtitle="Stellar Lumens"
                actAsExpander={false}
                showExpandableButton={false}
              />
              <CardText>
                <div className='balance'>
                  0 XLM
                </div>
                <div className='faded'>
                  0 {this.props.currency.default.toUpperCase()}
                </div>
              </CardText>
              <CardActions>
                <RaisedButton
                  onClick={this.handleOpen.bind(this)}
                  backgroundColor="rgb(15,46,83)"
                  labelColor="rgb(244,176,4)"
                  label="Deposit" />
              </CardActions>
              <CardText>
                <div className='faded'>
                  <i className="material-icons md-icon-small">info_outline</i>
                  Your account is currently inactive. Please deposit required
                  minimum reserve of 1 XLM in order to activate it.
                </div>
              </CardText>
            </Card>
          </MuiThemeProvider>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountInfo: state.accountInfo,
    auth: state.auth,
    modal: state.modal,
    currency: state.currency,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setExchangeRate,
    showAlert,
    hideAlert,
    setCurrency,
    setStreamer,
    accountExistsOnLedger,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Balances)
