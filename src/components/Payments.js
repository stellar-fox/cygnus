import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Tabs, Tab} from 'material-ui/Tabs'
import {List, ListItem, makeSelectable} from 'material-ui/List'
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
} from '../actions/index'
import './Payments.css'
import {pubKeyAbbr, utcToLocaleDateTime, getAssetCode} from '../lib/utils'

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
    paddingTop: 16,
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
  listItem: {
    width: '100%',
    border: '2px solid rgba(244,176,4,0.8)',
    borderRadius: '3px',
    marginTop: '12px',
    backgroundColor: 'rgba(244,176,4,1)',
  },
  listItemInnerDiv: {
    background: 'rgba(244,176,4,0.75) none repeat scroll 0% 0%',
    color: 'rgb(15,46,83)',
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
      },
    }
  }

  componentDidMount() {
    let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
    server.payments()
      // .limit(5)
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
            }})
          })
        })
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  handleTabSelect = (value) => {
    this.setState({
      tabSelected: value,
    })
    if (value === "2") {
      let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
      server.transactions()
        // .limit(5)
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

  handleOnClickListItem = (payment) => {
    payment.effects().then((effects) => {
      payment.transaction().then((tx) => {
        this.setState({paymentDetails: {
          txid: payment.id,
          created_at: payment.created_at,
          effects: effects._embedded.records,
          memo: tx.memo,
        }})
      })
    })
  }

  decodeEffectType = (effect, index) => {
    let humanizedEffectType = ''
    switch (effect.type) {
      case 'account_created':
      humanizedEffectType = (
        <div>
          <div className="flex-row">
            <div>
              <i className="material-icons">filter_{index+1}</i>
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
                } XLM
              </span>
            </div>
          </div>
          <div className="payment-details-body">
            <div>
              <span className="smaller">
                {pubKeyAbbr(effect.account)}
              </span>
              <div className="payment-details-fieldset">
                <div className="tiny">Memo: {this.state.paymentDetails.memo}</div>
                <div className="tiny">ID: {effect.id}</div>
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
                <i className="material-icons">filter_{index+1}</i>
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
                  } {getAssetCode(effect)}
                </span>
              </div>
            </div>
            <div className="payment-details-body">
              <div>
                <span className="smaller">
                  {pubKeyAbbr(effect.account)}
                </span>
                <div className="payment-details-fieldset">
                  <div className="tiny">Memo: {this.state.paymentDetails.memo}</div>
                  <div className="tiny">ID: {effect.id}</div>
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
                <i className="material-icons">filter_{index+1}</i>
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
                  } {getAssetCode(effect)}
                </span>
              </div>
            </div>
            <div className="payment-details-body">
              <div>
                <span className="smaller">
                  {pubKeyAbbr(effect.account)}
                </span>
                <div className="payment-details-fieldset">
                  <div className="tiny">Memo: {this.state.paymentDetails.memo}</div>
                  <div className="tiny">ID: {effect.id}</div>
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
                <i className="material-icons">filter_{index+1}</i>
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
                <span className="smaller">
                  {pubKeyAbbr(effect.account)}
                </span>
                <div className="payment-details-fieldset">
                  <div className="tiny">ID: {effect.id}</div>
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


  render() {

    return (
      <div>
        <MuiThemeProvider>
        <Tabs
          tabItemContainerStyle={styles.container}
          inkBarStyle={styles.inkBar}
          value={this.state.tabSelected}
          onChange={this.handleTabSelect}
        >
          <Tab style={styles.tab} label="History" value="1">
            <div className="tab-content">
              <div className="flex-row">
                <div>
                  <h2 style={styles.headline}>Payment History</h2>
                  <div className="account-title">
                    Credit and debit operations for your account.
                  </div>
                  <div className="account-subtitle">
                    Newest history shown as first.
                  </div>
                  {this.props.accountInfo.payments ?
                  <SelectableList defaultValue={1}>
                    {this.props.accountInfo.payments.records.map((payment, index) => (
                        <ListItem
                          value={index+1}
                          onClick={this.handleOnClickListItem.bind(this, payment)}
                          innerDivStyle={styles.listItemInnerDiv}
                          style={styles.listItem}
                          key={payment.id}
                          leftIcon={
                            payment.type === 'create_account' ?
                            (<i className="material-icons">account_balance</i>) :
                            (payment.to === this.props.accountInfo.pubKey ?
                              (<i className="material-icons">account_balance_wallet</i>) :
                              (<i className="material-icons">payment</i>))
                          }
                          hoverColor="rgb(244,176,4)"
                          secondaryText={
                            <span className="payment-date">
                              {utcToLocaleDateTime(payment.created_at)}
                            </span>
                          }
                          primaryText={
                            payment.type === 'create_account' ?
                              ('+' + Number.parseFloat(payment.starting_balance)
                                .toFixed(this.props.accountInfo.precision) + ' XLM') :
                              ((payment.to === this.props.accountInfo.pubKey ?
                                '+' : '-') + Number.parseFloat(payment.amount)
                                  .toFixed(this.props.accountInfo.precision) +
                                  ' ' + getAssetCode(payment))
                          }
                        />

                    ))}
                  </SelectableList>
                  : null}
                </div>
                <div className="payment-details">
                  <div className="transaction-id">
                    <div className="flex-row">
                      <div>
                        Payment ID: {this.state.paymentDetails.txid}
                      </div>
                      <div>
                        {utcToLocaleDateTime(this.state.paymentDetails.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="p-b p-t"></div>

                  {this.state.paymentDetails.effects.map((effect, index) => {
                    return (
                      <div key={index} className="payment-details-item">
                        <span className="effect-title">
                          {this.decodeEffectType(effect, index)}
                        </span>

                        <div className="p-b p-t"></div>
                      </div>
                    )
                  })}

                </div>
              </div>
            </div>
          </Tab>
          <Tab style={styles.tab} label="Transactions" value="2">
            <div className="tab-content">
              <div className="flex-row">
                <div>
                  <h2 style={styles.headline}>Account Transactions</h2>
                  <div className="account-title">
                    Each transaction represents a change to the account state.
                  </div>
                  <div className="account-subtitle">
                    Newest transactions shown as first.
                  </div>
                  <div className="p-b p-t"></div>
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
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
        </MuiThemeProvider>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    accountInfo: state.accountInfo,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setAccountPayments,
    setAccountTransactions,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Payments)
