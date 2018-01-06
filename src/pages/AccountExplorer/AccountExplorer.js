import React, {Component} from 'react'
import {
  Redirect
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new'
import CircularProgress from 'material-ui/CircularProgress'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import './AccountExplorer.css'


export default class AccountExplorer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedOut: false,
      xlm: 0,
      other: [],
      account: 'Loading',
      isLoading: true,
    }
  }

  componentDidMount() {
    let that = this
    let balances = {
      other: []
    }
    let server = new window.StellarSdk.Server('https://horizon.stellar.org')
    let pubKey = sessionStorage.getItem('pubKey')
    server.loadAccount(pubKey).then(function(account) {
      account.balances.forEach(function(balance) {
        if(balance.asset_type === 'native') {
          balances.xlm = balance.balance
        } else {
          balances.other.push({[balance.asset_code] : balance.balance})
        }
      })
      // update states here
      that.setState((prevState, props) => ({
        other: balances.other,
        xlm: balances.xlm,
        account: (
          sessionStorage.getItem('pubKey').slice(0, 3) + '-' +
          sessionStorage.getItem('pubKey').slice(53)
        ),
        isLoading: false,
      }))
    })
  }

  handleClick() {
    sessionStorage.clear()
    this.setState({
      loggedOut: true,
    })
  }

  render() {
    let otherAssets = this.state.other.map(function(el) {
      return (<p className='other-assets' key={Object.keys(el)[0]}>
        {Object.keys(el)[0]}: {el[Object.keys(el)[0]]}
      </p>)
    })
    return (
      <div>
        {this.state.loggedOut ? <Redirect to={{
          pathname: "/"
        }}/> : null}
        <MuiThemeProvider>
          <AppBar
            title="Stellar Fox"
            iconElementRight={
              <IconButton onClick={this.handleClick.bind(this)}>
                <PowerSettingsNew />
              </IconButton>
            }
            className="App-navbar"
          />
        </MuiThemeProvider>
        <MuiThemeProvider>
        {this.state.isLoading ? <div className='spinner-modal'><CircularProgress/></div> :
          <Card className='account'>
            <CardHeader
              title={"Account: " + this.state.account}
              subtitle={this.state.account}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText>
              <div className='balance'>{this.state.xlm} XLM</div>
            </CardText>
            <CardActions>
              <RaisedButton backgroundColor="rgb(244,176,4)" label="Deposit" />
              <RaisedButton backgroundColor="rgb(244,176,4)" label="Send" />
            </CardActions>
            <CardText expandable={true}>
              <div>
                <div>Other Assets</div>
                <div>{otherAssets}</div>
              </div>
            </CardText>
          </Card>
        }
        </MuiThemeProvider>
      </div>
    )
  }
}
