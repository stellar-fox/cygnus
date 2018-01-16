import React, {Component} from 'react'
import './Balances.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import axios from 'axios'
import {
  getEurRate,
  showAlert,
  hideAlert,
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
            <span className='other-asset-balance'>
              {
                Number.parseFloat(balance.balance).toFixed(2)
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
                  title="Current Balance"
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
                        )).toFixed(2)} XLM
                      </div>
                      <div>
                        {this.props.accountInfo.rates !== undefined ?
                          (Number.parseFloat(this.getNativeBalance.call(
                            this, this.props.accountInfo.account.account
                          )) * Number.parseFloat(
                            this.props.accountInfo.rates.xlmeur)
                          ).toFixed(2) : '0.00'
                        } EUR
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
                  0 EUR
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
                  minimum reserve of 0.5 XLM in order to activate it.
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
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getEurRate,
    showAlert,
    hideAlert,
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Balances)
