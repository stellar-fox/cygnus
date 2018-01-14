import React, {Component} from 'react'
import './Balances.css'
import {connect} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'


class Balances extends Component {

  getNativeBalance(account) {
    let nativeBalance = 0
    account.balances.forEach(function(balance) {
      if (balance.asset_type === 'native') {
        nativeBalance = balance.balance
      }
    })
    return nativeBalance
  }

  getOtherBalances(account) {
    return account.balances.map(function(balance) {
      if (balance.asset_type !== 'native') {
        console.log(balance)
        return (
          <p className='other-assets' key={balance.asset_code}>
            {balance.asset_code}: {balance.balance}
          </p>
        )
      }
      return undefined;
    })
  }

  render() {
    return (
      <div>
        {this.props.accountInfo.exists ? (
          <div>
            <MuiThemeProvider>
              <Card className='account'>
                <CardHeader
                  title="Current Balance"
                  subtitle="Native Currency"
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText>
                  <div className='balance'>{this.getNativeBalance.call(this, this.props.accountInfo.account.account)} XLM</div>
                </CardText>
                <CardActions>
                  <RaisedButton backgroundColor="rgb(244,176,4)" label="Deposit" />
                  <RaisedButton backgroundColor="rgb(244,176,4)" label="Send" />
                </CardActions>
                <CardText expandable={true}>
                  <div>
                    <div>Other Assets</div>
                    <div>{this.getOtherBalances.call(this, this.props.accountInfo.account.account)}</div>
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
  }
}

export default connect(mapStateToProps)(Balances)
