import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Tabs, Tab} from 'material-ui/Tabs'
import {List, ListItem} from 'material-ui/List';
import {
  setAccountOperations,
} from '../actions/index'
import './Payments.css'

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
}

class Payments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabSelected: '1'
    }
  }

  componentDidMount() {
    let that = this
    let server = new window.StellarSdk.Server('https://horizon.stellar.org')
    server.payments()
      .forAccount(this.props.accountInfo.pubKey)
      .call()
      .then(function (operationsResult) {
        that.props.setAccountOperations(operationsResult)
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
                  {this.props.accountInfo.operations ?
                  <List>
                    {this.props.accountInfo.operations.records.reverse().map((payment) => (
                      <ListItem
                        key={payment.id}
                        primaryText={
                          <span className="payment-date">
                            {new Date(payment.created_at).toLocaleString()}
                          </span>
                        }
                        secondaryText={
                          payment.type === 'create_account' ?
                            payment.starting_balance : payment.amount
                        }
                      />
                    ))}
                  </List>
                  : null}
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
    setAccountOperations,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Payments)
