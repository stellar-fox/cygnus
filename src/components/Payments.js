import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Tabs, Tab} from 'material-ui/Tabs'
import {List, ListItem, makeSelectable} from 'material-ui/List'
import SnackBar from '../frontend/snackbar/SnackBar'
import Avatar from 'material-ui/Avatar'
import RaisedButton from 'material-ui/RaisedButton'
import LoadingModal from './LoadingModal'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {
  setAccountPayments,
  setAccountTransactions,
  setStreamer,
  accountExistsOnLedger,
  accountMissingOnLedger,
  setTab,
  setModalLoading,
  setModalLoaded,
  updateLoadingMessage,
} from '../actions/index'
import './Payments.css'
import {pubKeyAbbr, utcToLocaleDateTime, getAssetCode, formatAmount} from '../lib/utils'

let SelectableList = makeSelectable(List)

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    }

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      })
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      })
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >{this.props.children}</ComposedComponent>
      )
    }
  }
}

SelectableList = wrapState(SelectableList)

const styles = {
  headline: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 400,
  },
  tab: {
    backgroundColor: '#2e5077',
    borderRadius: '3px',
    color: 'rgba(244,176,4,0.9)',
  },
  inkBar: {
    backgroundColor: 'rgba(244,176,4,0.8)',
  },
  container: {
    backgroundColor: '#2e5077',
    borderRadius: '3px',
  },
  table: {
    backgroundColor: 'rgb(15,46,83)',
  },
}

class Payments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabSelected: '1',
      paymentDetails: {
        txid: null,
        created_at: null,
        memo: '',
        effects: [],
        selectedPaymentId: null,
      },
      sbPayment: false,
      sbPaymentAmount: null,
      sbPaymentAssetCode: null,
    }
  }

  componentWillUnmount() {
    this.props.accountInfo.streamer.call(this)
  }

  componentDidMount() {
    console.log("WTF???")
    this.props.setModalLoading()
    this.props.updateLoadingMessage({
      message: "Loading payments data ..."
    })
    this.props.setStreamer(this.paymentsStreamer.call(this))

    let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
    server.payments()
      .limit(5)
      .forAccount(this.props.accountInfo.pubKey)
      .order('desc')
      .call()
      .then((paymentsResult) => {
        this.props.setAccountPayments(paymentsResult)
        paymentsResult.records[0].effects().then((effects) => {
          paymentsResult.records[0].transaction().then((tx) => {
            this.setState({paymentDetails: {
              txid: paymentsResult.records[0].id,
              created_at: paymentsResult.records[0].created_at,
              effects: effects._embedded.records,
              memo: tx.memo,
              selectedPaymentId: paymentsResult.records[0].id,
            }})
            this.props.setModalLoaded()
          })
        })
      })
      .catch(function (err) {
        console.log(err)
      })
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

        server.payments()
          .limit(5)
          .forAccount(this.props.accountInfo.pubKey)
          .order('desc')
          .call()
          .then((payments) => {
            this.props.setAccountPayments(payments)
          })
      }, (e) => {
        this.props.accountMissingOnLedger()
      })
  }


  handlePaymentSnackBarClose = () => {
    this.setState({
      sbPayment: false
    })
  }

  handleTabSelect = (value) => {
    this.props.setTab({payments: value})
    this.setState({
      tabSelected: value,
    })
    if (value === "2") {
      let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
      server.transactions()
        .limit(5)
        .forAccount(this.props.accountInfo.pubKey)
        .order('desc')
        .call()
        .then((txs) => {
          this.props.setAccountTransactions(txs)
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  }

  handlePaymentClick = (payment, paymentId) => {
    payment.effects().then((effects) => {
      payment.transaction().then((tx) => {
        this.setState({paymentDetails: {
          txid: payment.id,
          created_at: payment.created_at,
          effects: effects._embedded.records,
          memo: tx.memo,
          selectedPaymentId: paymentId
        }})
      })
    })
  }

  decodeEffectType = (effect, index) => {
    let humanizedEffectType = ''
    const icon = `filter_${index+1}`
    switch (effect.type) {
      case 'account_created':
      humanizedEffectType = (
        <div>
          <div className="flex-row">
            <div>
              <i className="material-icons">{icon}</i>
              <span>New Acccount Created </span>
              <span className="account-direction">
                {effect.account === this.props.accountInfo.pubKey ?
                  'Yours' : 'Theirs'}
              </span>
            </div>
            <div>
              <span className="credit">
                + {
                  Number.parseFloat(effect.starting_balance)
                    .toFixed(this.props.accountInfo.precision)
                } <span className="smaller">XLM</span>
              </span>
            </div>
          </div>
          <div className="payment-details-body">
            <div>
              <span className="payment-details-account">
                {pubKeyAbbr(effect.account)}
              </span>
              <div className="payment-details-fieldset">
                <div className="payment-details-memo">
                  <span className="smaller">Memo:</span> {this.state.paymentDetails.memo}
                </div>
                <div className="payment-details-id">
                  ID: {effect.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
        break;
      case 'account_removed':
        humanizedEffectType = 'Acccount removed'
        break;
      case 'account_credited':
        humanizedEffectType = (
          <div>
            <div className="flex-row">
              <div>
                <i className="material-icons">{icon}</i>
                <span>Acccount Credited </span>
                <span className="account-direction">
                  {effect.account === this.props.accountInfo.pubKey ?
                    'Yours' : 'Theirs'}
                </span>
              </div>
              <div>
                <span className="credit">
                  + {
                    Number.parseFloat(effect.amount)
                      .toFixed(this.props.accountInfo.precision)
                  } <span className="smaller">{getAssetCode(effect)}</span>
                </span>
              </div>
            </div>
            <div className="payment-details-body">
              <div>
                <span className="payment-details-account">
                  {pubKeyAbbr(effect.account)}
                </span>
                <div className="payment-details-fieldset">
                  <div className="payment-details-memo">
                    <span className="smaller">Memo:</span> {this.state.paymentDetails.memo}
                  </div>
                  <div className="payment-details-id">
                    ID: {effect.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      case 'account_debited':
        humanizedEffectType = (
          <div>
            <div className="flex-row">
              <div>
                <i className="material-icons">{icon}</i>
                <span>Acccount Debited </span>
                <span className="account-direction">
                  {effect.account === this.props.accountInfo.pubKey ?
                    'Yours' : 'Theirs'}
                </span>
              </div>
              <div>
                <span className='debit'>
                  - {
                    Number.parseFloat(effect.amount)
                      .toFixed(this.props.accountInfo.precision)
                  } <span className="smaller">{getAssetCode(effect)}</span>
                </span>
              </div>
            </div>
            <div className="payment-details-body">
              <div>
                <span className="payment-details-account">
                  {pubKeyAbbr(effect.account)}
                </span>
                <div className="payment-details-fieldset">
                  <div className="payment-details-memo">
                    <span className="smaller">Memo:</span> {this.state.paymentDetails.memo}
                  </div>
                  <div className="payment-details-id">
                    ID: {effect.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      case 'signer_created':
        humanizedEffectType = (
          <div>
            <div className="flex-row">
              <div>
                <i className="material-icons">{icon}</i>
                <span>Signer Created ✎ </span>
                <span className="account-direction">
                  {effect.public_key === this.props.accountInfo.pubKey ?
                    'You' : 'They'}
                </span>
              </div>
              <div>
              </div>
            </div>
            <div className="payment-details-body">
              <div>
                <span className="payment-details-account">
                  {pubKeyAbbr(effect.account)}
                </span>
                <div className="payment-details-fieldset">
                  <div className="payment-details-id">ID: {effect.id}</div>
                </div>
              </div>
            </div>
          </div>
        )
        break;
      default:
        humanizedEffectType = effect.type
        break;
    }
    return humanizedEffectType
  }


  getNextPaymentsPage() {
    this.props.accountInfo.payments.next().then((payments) => {
      if (payments.records.length > 0) {
        this.props.setAccountPayments(payments)
      } else {
        let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
        server.payments()
          .limit(5)
          .forAccount(this.props.accountInfo.pubKey)
          .order('desc')
          .call()
          .then((payments) => {
            this.props.setAccountPayments(payments)
          })
      }
    })
  }

  getNextTransactionsPage() {
    this.props.accountInfo.transactions.next().then((txs) => {
      if (txs.records.length > 0) {
        this.props.setAccountTransactions(txs)
      } else {
        let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
        server.transactions()
          .limit(5)
          .forAccount(this.props.accountInfo.pubKey)
          .order('desc')
          .call()
          .then((txs) => {
            this.props.setAccountTransactions(txs)
          })
      }
    })
  }


  render() {

    return (
      <div>
        <LoadingModal/>
        <MuiThemeProvider>
        <div>
        <SnackBar
          open={this.state.sbPayment}
          message={`${this.state.sbPaymentText} ${this.state.sbPaymentAmount} ${this.state.sbPaymentAssetCode}`}
          onRequestClose={this.handlePaymentSnackBarClose.bind(this)}
        />
        <Tabs
          tabItemContainerStyle={styles.container}
          inkBarStyle={styles.inkBar}
          value={this.props.ui.tabs.payments}
          onChange={this.handleTabSelect}
        >
          <Tab style={styles.tab} label="History" value="1">
            <div className="tab-content">

              <div className="account-title">
                Payment History
              </div>
              <div className="account-subtitle">
                Newest payments shown as first.
              </div>

              <div className="flex-row-space-between">
                <div className="flex-row-column">
                  <div>
                  {this.props.accountInfo.payments ?
                  <div>
                  <SelectableList defaultValue={1}>
                    {this.props.accountInfo.payments.records.map((payment, index) => (
                        <div key={payment.id}
                          className={
                            this.state.paymentDetails.selectedPaymentId === payment.id ?
                              'payment-item-active' : 'payment-item'
                          }>
                        <ListItem
                          value={index+1}
                          onClick={this.handlePaymentClick.bind(this, payment, payment.id)}
                          leftIcon={
                            payment.type === 'create_account' ?
                            ((payment.funder === this.props.accountInfo.pubKey ?
                              <i className="material-icons">card_giftcard</i> :
                              <i className="material-icons">account_balance</i>)) :
                            (payment.to === this.props.accountInfo.pubKey ?
                              (<i className="material-icons">account_balance_wallet</i>) :
                              (<i className="material-icons">payment</i>))
                          }
                          hoverColor="rgba(244,176,4,0.95)"
                          secondaryText={
                            <span className="payment-date">
                              {utcToLocaleDateTime(payment.created_at)}
                            </span>
                          }
                          primaryText={
                            payment.type === 'create_account' ?
                              ((payment.funder === this.props.accountInfo.pubKey ?
                                '-' : '+') + Number.parseFloat(payment.starting_balance)
                                .toFixed(this.props.accountInfo.precision) + ' XLM') :
                              ((payment.to === this.props.accountInfo.pubKey ?
                                '+' : '-') + Number.parseFloat(payment.amount)
                                  .toFixed(this.props.accountInfo.precision) +
                                  ' ' + getAssetCode(payment))
                          }
                          rightAvatar={
                            <Avatar
                              className="square-avatar"
                              backgroundColor="rgba(244,176,4,1)"
                              size={54}
                              src={
                                parseInt(payment.id.charAt(payment.id.length-2),10) % 2 ?
                                '/img/mimi.jpg' : (parseInt(payment.id.charAt(payment.id.length-3),10) % 2 ?
                                  '/img/igor.jpg' : '/img/gravatar.jpg')
                              } />
                          }
                        />
                        </div>

                    ))}
                  </SelectableList>
                  </div>
                  : null}
                  <div>
                    <MuiThemeProvider>
                      <RaisedButton
                        backgroundColor="rgba(244,176,4,1)"
                        onClick={this.getNextPaymentsPage.bind(this)}
                        label="Next Page"
                      />
                    </MuiThemeProvider>
                  </div>
                  </div>
                </div>
                <div className="flex-row-column">
                  <div>
                    <div className="transaction-details-header">
                      <div className="flex-row">
                        <div>
                          Payment ID: {this.state.paymentDetails.txid}
                        </div>
                        <div>
                          {utcToLocaleDateTime(this.state.paymentDetails.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="transaction-details-body">
                      {this.state.paymentDetails.effects.map((effect, index) => {
                        return (
                          <div key={index} className="payment-details-item">
                            <span className="effect-title">
                              {this.decodeEffectType(effect, index)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab style={styles.tab} label="Transactions" value="2">
            <div className="tab-content">
              <div className="flex-row">
                <div>
                  <div className="account-title">
                    Account Transactions
                  </div>
                  <div className="account-subtitle">
                    Newest transactions shown as first.
                  </div>
                  <div className="p-t"></div>
                  {this.props.accountInfo.transactions ? (
                  <Table style={styles.table}>
                    <TableHeader className="tx-table-header" displaySelectAll={false} adjustForCheckbox={false}>
                      <TableRow className="tx-table-row" style={styles.tableRow}>
                        <TableHeaderColumn className="tx-table-header-column">Transaction Time</TableHeaderColumn>
                        <TableHeaderColumn className="tx-table-header-column">Account</TableHeaderColumn>
                        <TableHeaderColumn className="tx-table-header-column">Memo</TableHeaderColumn>
                        <TableHeaderColumn className="tx-table-header-column">Fee Paid</TableHeaderColumn>
                        <TableHeaderColumn className="tx-table-header-column">Signature Count</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {this.props.accountInfo.transactions.records.map((tx, index) => (
                        <TableRow selectable={false} key={index} className="tx-table-row">
                          <TableRowColumn className="tx-table-row-column">
                            {utcToLocaleDateTime(tx.created_at)}
                          </TableRowColumn>
                          <TableRowColumn className="tx-table-row-column">
                            <span>
                              <span>
                                {pubKeyAbbr(tx.source_account)}
                              </span>
                              <span className="account-direction">
                                {tx.source_account === this.props.accountInfo.pubKey ?
                                  'Yours' : 'Theirs'}
                              </span>
                            </span>
                          </TableRowColumn>
                          <TableRowColumn className="tx-table-row-column">
                            {tx.memo}
                          </TableRowColumn>
                          <TableRowColumn className="tx-table-row-column">
                            {tx.fee_paid}
                          </TableRowColumn>
                          <TableRowColumn className="tx-table-row-column">
                            {tx.signatures.length}
                          </TableRowColumn>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>) : null }
                  <div className="p-b"></div>
                  <MuiThemeProvider>
                    <RaisedButton
                      backgroundColor="rgba(244,176,4,1)"
                      onClick={this.getNextTransactionsPage.bind(this)}
                      label="Next Page"
                    />
                  </MuiThemeProvider>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
        </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountInfo: state.accountInfo,
    loadingModal: state.loadingModal,
    ui: state.ui,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setAccountPayments,
    setAccountTransactions,
    setStreamer,
    accountExistsOnLedger,
    accountMissingOnLedger,
    setTab,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Payments)
