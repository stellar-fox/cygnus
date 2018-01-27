import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Tabs, Tab} from 'material-ui/Tabs'
import {List, ListItem, makeSelectable} from 'material-ui/List'

import {
  setAccountPayments,
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
    background: 'rgba(244,176,4,0.65) none repeat scroll 0% 0%',
    color: 'rgb(15,46,83)',
  },
  avatar: {
    border: '2px solid rgba(244,176,4,0.75)',
    borderRadius: '3px',
  },
  stepperIcon: {
    borderRadius: '3px',
    backgroundColor: '#2e5077',
    color: 'rgb(244,176,4)',
  },
  stepperButton: {
    border: '2px solid rgba(244,176,4,0.75)',
    backgroundColor: '#2e5077',
    borderRadius: '3px',
  },
}

class Payments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabSelected: '1',
      paymentDetails: {
        txid: null,
        effects: [],
      },
    }
  }

  componentDidMount() {
    let that = this
    let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
    server.payments()
      // .limit(5)
      .forAccount(this.props.accountInfo.pubKey)
      .order('desc')
      .call()
      .then(function (paymentsResult) {
        that.props.setAccountPayments(paymentsResult)
        paymentsResult.records[0].effects().then((effects) => {
          that.setState({paymentDetails: {
            txid: paymentsResult.records[0].id,
            created_at: paymentsResult.records[0].created_at,
            effects: effects._embedded.records.reverse(),
          }})
        })
        // paymentsResult.records.map((payment) => {
        //
        //   payment.transaction().then((tx) => {
        //     let txJSON = window.StellarSdk.xdr.TransactionMeta.fromXDR(
        //       tx.result_meta_xdr, 'base64'
        //     )
        //     console.log(tx)
        //     console.log(txJSON)
        //   })
        //
        //   payment.effects().then((effects) => {
        //     console.log('-------- ' + payment.transaction_hash +  ' -------')
        //     effects._embedded.records.map((effect) => {
        //       console.log({[payment.transaction_hash]: effect})
        //       that.props.setPaymentEffects({[payment.transaction_hash]: effect})
        //       return true
        //     })
        //   })
        //   return true
        // })


      })
      .catch(function (err) {
        console.log(err)
      })
  }

  handleTabSelect = (value) => {
    this.setState({
      tabSelected: value,
    })
  }

  handleOnClickListItem = (payment) => {
    let that = this
    payment.effects().then((effects) => {
      console.log(effects)
      that.setState({paymentDetails: {
        txid: payment.id,
        created_at: payment.created_at,
        effects: effects._embedded.records.reverse(),
      }})
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
                <div>ID: {effect.id}</div>
                <div>Paging Token: {effect.paging_token}</div>
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
                  <div>ID: {effect.id}</div>
                  <div>Paging Token: {effect.paging_token}</div>
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
                  <div>ID: {effect.id}</div>
                  <div>Paging Token: {effect.paging_token}</div>
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
                  {effect.account === this.props.accountInfo.pubKey ?
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
                  <div>ID: {effect.id}</div>
                  <div>Paging Token: {effect.paging_token}</div>
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
                          leftIcon={<i className="material-icons">payment</i>}
                          hoverColor="rgb(244,176,4)"
                          primaryText={
                            <span className="payment-date">
                              {new Date(payment.created_at).toLocaleString()}
                            </span>
                          }
                          secondaryText={
                            payment.type === 'create_account' ?
                              ('Initial Fund: ' + payment.starting_balance) : payment.amount
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
          <Tab style={styles.tab} label="Operations" value="2">
            <div className="tab-content">
              <div className="flex-row">
                <div>
                  <h2 style={styles.headline}>Account Operations</h2>
                  <div className="account-title">
                    Account related operations.
                  </div>
                  <div className="account-subtitle">
                    Newest operations shown as first.
                  </div>
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
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Payments)
