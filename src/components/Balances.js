import React, {Component} from 'react'
import './Balances.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import axios from 'axios'
import {
  getEurRate,
} from '../actions/index'
class Balances extends Component {

  componentDidMount() {
    this.getExchangeRate('eur')
  }

  getNativeBalance(account) {
    let nativeBalance = 0
    account.balances.forEach(function(balance) {
      if (balance.asset_type === 'native') {
        nativeBalance = balance.balance
      }
    })
    return nativeBalance
  }

  getExchangeRate(currency) {
    const cryptonatorXlmTicker = 'https://api.cryptonator.com/api/ticker/xlm-'
    let that = this
    axios.get(cryptonatorXlmTicker + currency)
      .then(function (response) {
        if (response.data.success === true) {
          that.props.getEurRate({xlmeur: response.data.ticker.price})
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getOtherBalances(account) {
    return account.balances.map(function(balance) {
      if (balance.asset_type !== 'native') {
        return (
          <p className='other-assets' key={balance.asset_code}>
            {balance.asset_code}: {balance.balance}
          </p>
        )
      }
      return undefined
    })
  }

  render() {
    let otherBalances
    if (this.props.accountInfo.exists) {
      otherBalances = this.getOtherBalances.call(
        this, this.props.accountInfo.account.account
      )
    }
    return (
      <div>
        {this.props.accountInfo.exists ? (
          <div>
            <MuiThemeProvider>
              <Card className='account'>
                <CardHeader
                  title="Current Balance"
                  subtitle="Stellar Lumens"
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText>
                  <div className='balance'>
                    {Number.parseFloat(this.getNativeBalance.call(
                      this, this.props.accountInfo.account.account
                    )).toFixed(2)} XLM
                  </div>
                  <div>
                    {this.props.accountInfo.rates !== undefined ?
                      (Number.parseFloat(this.getNativeBalance.call(
                        this, this.props.accountInfo.account.account
                      )) * Number.parseFloat(
                        this.props.accountInfo.rates.xlmeur)
                      ).toFixed(2) : '---'
                    } EUR
                  </div>
                </CardText>
                {this.props.auth.isReadOnly ? null :
                  <CardActions>
                    <RaisedButton backgroundColor="rgb(244,176,4)" label="Deposit" />
                    <RaisedButton backgroundColor="rgb(244,176,4)" label="Send" />
                  </CardActions>
                }
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
                title="This account does not exist on Stellar ledger."
                subtitle="Please deposit a minimum of 0.5 XLM to activate the account."
                actAsExpander={false}
                showExpandableButton={false}
              />
              <CardActions>
                <RaisedButton backgroundColor="rgb(244,176,4)" label="Deposit" />
              </CardActions>
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
    // exchangeRates: state.exchangeRates,
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getEurRate,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Balances)
