import React, {Component} from "react"
import "./Balances.css"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import Dialog from "material-ui/Dialog"
import SnackBar from "../frontend/snackbar/SnackBar"
import axios from "axios"
import { formatAmount } from "../lib/utils"
import {config} from "../config"
import RegisterAccount from "./RegisterAccount"
import TextInputField from "./TextInputField"
import { signTransaction } from "../lib/ledger"
import DatePicker from "material-ui/DatePicker"
import {
    pubKeyValid,
    federationAddressValid,
    federationLookup,
} from "../lib/utils"
import {
    setExchangeRate,
    showAlert,
    hideAlert,
    setCurrency,
    setStreamer,
    setCurrencyPrecision,
    accountExistsOnLedger,
    accountMissingOnLedger,
} from "../actions/index"
import debounce from "lodash/debounce"
import numberToText from "number-to-text"
import "number-to-text/converters/en-us"

const styles = {
    errorStyle: {
        color: "#912d35",
    },
    underlineStyle: {
        borderColor: "rgba(15,46,83,0.6)",
        width: "100%",
    },
    floatingLabelStyle: {
        color: "rgba(15,46,83,0.5)",
    },
    floatingLabelFocusStyle: {
        color: "rgba(15,46,83,0.35)",
    },
    inputStyle: {
        color: "rgba(15,46,83,0.8)",
    },
}


class Balances extends Component {
    
    // ...
    constructor (props) {
        super(props)
        this.state = {
            sbPayment: false,
            sbPaymentAmount: null,
            sbPaymentAssetCode: null,
            modalShown: false,
            modalButtonText: "CANCEL",
            amountEntered: false,
            currencySymbol: null,
            currencyText: null,
            payee: null,
            memo: null,
            payDate: new Date(),
            memoRequired: false,
            
            paymentDestinationValid: false,
            amountValid: false,
            memoValid: false,
            buttonSendDisabled: true,

        }
    }


    // ...
    componentDidMount () {
        if (this.props.auth.isAuthenticated) {
            axios.get(`${config.api}/account/${this.props.auth.userId}`)
                .then((response) => {
                    this.props.setCurrency(response.data.data.currency)
                    this.props.setCurrencyPrecision(response.data.data.precision)
                    this.getExchangeRate(response.data.data.currency)
                    this.setState({
                        currencySymbol: this.getCurrencySymbol(response.data.data.currency),
                        currencyText: this.getCurrencyText(response.data.data.currency),
                    })
                })
                .catch((error) => {
                    console.log(error.message) // eslint-disable-line no-console
                })
        } else {
            this.getExchangeRate(this.props.accountInfo.currency)
        }
        this.props.setStreamer(this.paymentsStreamer.call(this))

        // TEMPORARY!!
        this.setState({
            currencySymbol: this.getCurrencySymbol(this.props.accountInfo.currency),
            currencyText: this.getCurrencyText(this.props.accountInfo.currency),
        })
    }


    // ...
    componentWillUnmount () {
        this.props.accountInfo.streamer.call(this)
    }


    // ...
    getCurrencySymbol (currency) {
        return currency
    }


    // ...
    getCurrencyText (currency) {
        let text = ""
        switch (currency) {
            case "eur":
                text = "EUROS"
                break
            case "thb":
                text = "THAI BAHT"
                break
            case "pln":
                text = "ZŁOTYCH"
                break
            default:
                text = "DOLLARS"
                break
        }
        return text
    }
    
    // ...
    paymentsStreamer () {
        let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
        return server.payments().cursor("now").stream({
            onmessage: (message) => {
                /*
                * Initial Account Funding
                */
                if (message.type === "create_account" && message.account === this.props.accountInfo.pubKey) {
                    this.updateAccount.call(this)
                    this.setState({
                        sbPayment: true,
                        sbPaymentText: "Account Funded: ",
                        sbPaymentAmount: formatAmount(
                            message.starting_balance, this.props.accountInfo.precision),
                        sbPaymentAssetCode: "XLM",
                    })
                }

                /*
                * Receiving Payment
                */
                if (message.type === "payment" && message.to === this.props.accountInfo.pubKey) {
                    this.updateAccount.call(this)
                    this.setState({
                        sbPayment: true,
                        sbPaymentText: "Payment Received: ",
                        sbPaymentAmount: formatAmount(
                            message.amount, this.props.accountInfo.precision),
                        sbPaymentAssetCode: (
                            message.asset_type === "native" ? "XLM" : message.asset_code
                        ),
                    })
                }

                /*
                * Sending Payment
                */
                if (message.type === "payment" && message.from === this.props.accountInfo.pubKey) {
                    this.updateAccount.call(this)
                    this.setState({
                        sbPayment: true,
                        sbPaymentText: "Payment Sent: ",
                        sbPaymentAmount: formatAmount(
                            message.amount, this.props.accountInfo.precision),
                        sbPaymentAssetCode: (
                            message.asset_type === "native" ? "XLM" : message.asset_code
                        ),
                    })
                }
            },
        })
    }

    // ...
    updateDate (value) {
        this.setState({
            // payDate: utcToLocaleDateTime(value),
            payDate: value,
        })
    }

    // ...
    updateAccount () {
        let server = new window.StellarSdk.Server(this.props.accountInfo.horizon)
        server.loadAccount(this.props.accountInfo.pubKey)
            .catch(window.StellarSdk.NotFoundError, (_) => {
                throw new Error("The destination account does not exist!")
            })
            .then((account) => {
                this.props.accountExistsOnLedger({account,})
            }, (_) => {
                this.props.accountMissingOnLedger()
            })
    }


    // ...
    getNativeBalance (account) {
        let nativeBalance = 0
        account.balances.forEach((balance) => {
            if (balance.asset_type === "native") {
                nativeBalance = balance.balance
            }
        })
        return nativeBalance
    }


    // ...
    exchangeRateFetched () {
        if (this.props.accountInfo.rates !== undefined &&
            this.props.accountInfo.rates[this.props.accountInfo.currency] !== undefined
        ) {
            return true
        }
        return false
    }


    // ...
    exchangeRateStale () {
        if (this.props.accountInfo.rates === undefined ||
            this.props.accountInfo.rates[this.props.accountInfo.currency] === undefined ||
            this.props.accountInfo.rates[this.props.accountInfo.currency].lastFetch + 300000 < Date.now()
        ) {
            return true
        }
        return false
    }


    // ...
    getExchangeRate (currency) {
        if (this.exchangeRateStale()) {
            axios.get(`${config.api}/ticker/latest/${currency}`)
                .then((response) => {
                    this.props.setExchangeRate({[currency]: {
                        rate: response.data.data[`price_${currency}`],
                        lastFetch: Date.now(),
                    },})
                })
                .catch(function (error) {
                    console.log(error.message) // eslint-disable-line no-console
                })
        }
    }


    // ...
    getOtherBalances (account) {
        return account.balances.map((balance) => {
            if (balance.asset_type !== "native") {
                return (
                    <p className="other-assets" key={balance.asset_code}>
                        <span className="other-asset-balance">
                            {Number.parseFloat(balance.balance).toFixed(this.props.accountInfo.precision)}
                        </span>
                        <span className="other-asset-code">
                            {balance.asset_code}
                        </span>
                    </p>
                )
            }
            return undefined
        })
    }


    // ...
    handleOpen () {
        this.props.showAlert()
    }


    // ...
    handleClose () {
        this.props.hideAlert()
    }


    // ...
    handlePaymentSnackBarClose () {
        this.setState({
            sbPayment: false,
        })
    }


    // ...
    handleModalClose () {
        this.setState({
            modalShown: false,
        })
    }


    // ...
    handleSignup () {
        this.setState({
            modalButtonText: "CANCEL",
            modalShown: true,
        })
    }


    // ...
    setModalButtonText (text) {
        this.setState({
            modalButtonText: text,
        })
    }


    // ...
    async sendPayment () {
        console.log("send payment")
        return true
    }


    // ...
    compoundPaymentValidator () {
        
        if (!this.state.payee) {
            this.setState({
                buttonSendDisabled: true,
            })
            return false
        }

        if (!this.state.amountEntered) {
            this.setState({
                buttonSendDisabled: true,
            })
            return false
        }

        if (!this.state.memoValid && this.state.memoRequired) {
            this.setState({
                buttonSendDisabled: true,
            })
            return false
        }

        this.setState({
            buttonSendDisabled: false,
        })
        
        return true
    }


    // ...
    memoValidator () {
        
        this.setState({
            memoValid: true,
        })
        this.compoundPaymentValidator.call(this)
        // (this.state.memoRequired && this.textInputFieldMemo.state.value !== "") ? true : false
        return true
    }

    // ...
    amountValidator () {

        // nothing was typed (reset any previous errors)
        if (this.textInputFieldAmount.state.value === "") {
            this.setState({
                amountEntered: false,
                amountValid: false,
            })
            this.textInputFieldAmount.setState({
                error: null,
            })
            this.compoundPaymentValidator.call(this)
            return null
        }

        let parsedValidAmount = this.textInputFieldAmount.state.value.match(
            /^(\d+)([.,](\d{1,2}))?$/
        )
        
        // check if amount typed is valid
        if (parsedValidAmount) {
            // decimals present
            if (parsedValidAmount[3]) {
                this.setState({
                    amountEntered: true,
                    amountText: `${numberToText.convertToText(parsedValidAmount[1])} and ${parsedValidAmount[3]}/100`,
                })
            }
            // whole amount
            else {
                this.setState({
                    amountEntered: true,
                    amountText: numberToText.convertToText(parsedValidAmount[1]),
                })
            }
            this.textInputFieldAmount.setState({
                error: null,
            })
            this.compoundPaymentValidator.call(this)
            return null
        }
        
        // invalid amount was typed in
        else {
            this.setState({
                amountEntered: false,
            })
            this.textInputFieldAmount.setState({
                error: "invalid amount entered",
            })
            this.compoundPaymentValidator.call(this)
            return "invalid amount entered"
        }
        
    }


    // ...
    federationValidator () {
        // reset any previous errors
        this.textInputFieldFederationAddress.setState({
            error: null,
        })

        const address = this.textInputFieldFederationAddress.state.value
        // Looks like something totally invalid for this field.
        if (!address.match(/\*/) && !address.match(/^G/)) {
            return "invalid input"
        }
        // Looks like user is entering Federation Address format.
        if (address.match(/\*/) && !federationAddressValid(address)) {
            return "invalid federation address"
        }
        // This must be an attempt at a Stellar public key format.
        if (address.match(/^G/) && !address.match(/\*/)) {
            let publicKeyValidityObj = pubKeyValid(address)
            if (!publicKeyValidityObj.valid) {
                return publicKeyValidityObj.message
            }
        }

        return null
    }


    // ...
    compoundFederationValidator () {
        const addressValidity = this.federationValidator(
            this.textInputFieldFederationAddress.state.value
        )
        if (addressValidity === null) {
            
            // valid federation address
            if (this.textInputFieldFederationAddress.state.value.match(/\*/)) {
                federationLookup(this.textInputFieldFederationAddress.state.value)
                    .then((federationEndpointObj) => {
                        if (federationEndpointObj.ok) {
                            axios
                                .get(`${federationEndpointObj.endpoint}?q=${this.textInputFieldFederationAddress.state.value}&type=name`)
                                .then((response) => {
                                    this.setState({
                                        payee: response.data.account_id,
                                    })
                                    this.compoundPaymentValidator.call(this)
                                })
                                .catch((error) => {
                                    this.setState({
                                        payee: null,
                                    })
                                    this.compoundPaymentValidator.call(this)
                                    if (error.response.data.detail) {
                                        this.textInputFieldFederationAddress.setState({
                                            error: error.response.data.detail,
                                        })
                                    } else {
                                        this.textInputFieldFederationAddress.setState({
                                            error: error.response.data.message,
                                        })
                                    }
                                })
                        } else {
                            this.setState({
                                payee: null,
                            })
                            this.compoundPaymentValidator.call(this)
                            this.textInputFieldFederationAddress.setState({
                                error: federationEndpointObj.error.message,
                            })
                        }
                    })
                    .catch((error) => {
                        this.setState({
                            payee: null,
                        })
                        this.compoundPaymentValidator.call(this)
                        this.textInputFieldFederationAddress.setState({
                            error: error.message,
                        })
                        console.log(error) // eslint-disable-line no-console
                    })
            }

            // valid public key
            else {
                console.log("it's a public key")
            }
            
            
        }
    }
    
    // ...
    render () {


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
        onClick={this.handleClose.bind(this)}
      />,
    ]

    const registerAccountActions = [
      <FlatButton
        backgroundColor="rgb(244,176,4)"
        labelStyle={{ color: "rgb(15,46,83)" }}
        label={this.state.modalButtonText}
        keyboardFocused={false}
        onClick={this.handleModalClose.bind(this)}
      />,
    ]

    return (
      <div>
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
          <Dialog
            title="Registering Your Account"
            actions={registerAccountActions}
            modal={true}
            open={this.state.modalShown}
            onRequestClose={this.handleModalClose.bind(this)}
            paperClassName="modal-body"
            titleClassName="modal-title"
            repositionOnUpdate={false}
          >
            <RegisterAccount onComplete={this.setModalButtonText.bind(this)} />
          </Dialog>
        </div>

        {(!this.props.accountInfo.registered && !this.props.auth.isReadOnly) ? (
          <div className="p-t">
            <Card className="welcome-card">
              <CardText>
                <div className="flex-row">
                  <div>
                    <div className="balance">
                      Hi there!
                    </div>
                    <div>
                      <p>
                        It looks like this account is not yet registered with our service.
                        Registered accounts allow you to transact easily with anyone and
                        have a lot of cool features! Here are some of them:
                      </p>
                      <ul>
                        <li>Pay to contact</li>
                        <li>Customize and manage your payment address</li>
                        <li>Address book of your payment contacts</li>
                        <li>Manage powerful account settings</li>
                      </ul>
                      <p>Would you like to open one today? It's super easy!</p>
                    </div>
                  </div>
                  <div></div>
                </div>
              </CardText>
              <CardActions>
                <RaisedButton
                  onClick={this.handleSignup.bind(this)}
                  backgroundColor="rgb(15,46,83)"
                  labelColor="rgb(244,176,4)"
                  label="Open Account"
                />
                <FlatButton
                  label="MAYBE LATER"
                  disableTouchRipple={true}
                  disableFocusRipple={true}
                  labelStyle={{ color: "rgb(15,46,83)" }}
                  onClick={this.handleOpen.bind(this)}
                />
              </CardActions>
              <CardText>
                <div className='faded'>
                  <i className="material-icons md-icon-small">info_outline</i>
                  Registering with our service is free. Forever. We only charge fractional fees when you choose to use our remittance service.
              </div>
              </CardText>
            </Card>
          </div>
        ) : null}

        {this.props.accountInfo.exists ? (
          <div>
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
                      {this.exchangeRateFetched() ?
                        (Number.parseFloat(this.getNativeBalance.call(
                          this, this.props.accountInfo.account.account
                        )) * Number.parseFloat(
                          this.props.accountInfo.rates[this.props.accountInfo.currency].rate)
                        ).toFixed(2) : '0.00'
                      } {this.props.accountInfo.currency.toUpperCase()}
                    </div>
                    <div>
                      {Number.parseFloat(this.getNativeBalance.call(
                        this, this.props.accountInfo.account.account
                      )).toFixed(this.props.accountInfo.precision)} XLM
                    </div>
                  </div>
                  <div></div>
                </div>
              </CardText>
              <CardActions>
                <RaisedButton
                  backgroundColor="rgb(15,46,83)"
                  labelColor="#228B22"
                  label="Deposit"
                  onClick={this.handleOpen.bind(this)}
                />
                <RaisedButton
                  backgroundColor="rgb(15,46,83)"
                  labelColor="rgb(244,176,4)"
                  label="Request"
                  onClick={this.handleOpen.bind(this)}
                />
                {this.props.auth.isReadOnly ? null :
                  <RaisedButton
                    backgroundColor="rgb(15,46,83)"
                    labelColor="#d32f2f"
                    label="Send"
                    onClick={this.showPaymentModal.bind(this)}
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
          </div>
        ) : (
          <Card className='account'>
            <CardHeader
              title={
                <span>
                  <span>Current Balance </span>
                  <i className="material-icons">hearing</i>
                </span>
              }
              subtitle="Stellar Lumens"
              actAsExpander={false}
              showExpandableButton={false}
            />
            <CardText>
              <div className='flex-row'>
                <div>
                  <div className='balance'>
                    0 {this.props.accountInfo.currency.toUpperCase()}
                  </div>
                  <div>
                    0 XLM
                </div>
                </div>
                <div></div>
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
        )}

            
                <Card className="payment-card">
                    <CardText>
                        <div className="f-e">
                            
                            <DatePicker
                                className="date-picker"
                                defaultDate={this.state.payDate}
                                floatingLabelText="Date"
                            />
                        </div>
                        <div className="f-s space-between">
                            <div className="payment-header f-s">
                                <div className="p-r leading-label-align nowrap">
                                    Pay to the order of:
                                </div>
                                <div className="p-r">
                                    <TextInputField
                                        floatingLabelText="Payment Address"
                                        styles={styles}
                                        validator={
                                            debounce(this.compoundFederationValidator.bind(this), 1000)
                                        }
                                        ref={(self) => {
                                            this.textInputFieldFederationAddress = self
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="payment-header f-s">
                                <div className="p-r leading-label-align payment-currency">
                                    {this.state.currencySymbol === "eur" && (
                                        <span>&#x020AC;</span>
                                    )}
                                    {this.state.currencySymbol === "usd" && (
                                        <span>&#x00024;</span>
                                    )}
                                </div>
                                <div>
                                    <TextInputField
                                        validator={
                                            debounce(this.amountValidator.bind(this), 500)
                                        }
                                        ref={(self) => {
                                            this.textInputFieldAmount = self
                                        }}
                                        floatingLabelText="Amount"
                                        styles={styles}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="f-s space-between verbatim-underlined">
                            <div>
                                {this.state.amountEntered && this.state.amountText}
                            </div>
                            <div>{this.state.currencyText}</div>
                        </div>
                        <div className="p-t"></div>
                        <div className="f-e">
                            <div>
                                <i className="material-icons">lock</i>
                            </div>
                            <div className="micro nowrap">
                                Security Features
                            </div>

                        </div>
                        <div className="p-b p-t"></div>
                        <div className="f-s space-between">
                            <div>
                                <span className="payment-header">
                                    <span className="p-r">For:</span>
                                    <TextInputField
                                        floatingLabelText="Memo"
                                        styles={styles}
                                        ref={(self) => {
                                            this.textInputFieldMemo = self
                                        }}
                                        validator={
                                            debounce(this.memoValidator.bind(this), 500)
                                        }
                                    />
                                </span>
                            </div>
                        </div>
                    </CardText>
                    <CardActions>
                        <div className="f-e space-between">
                            <div className='faded p-l nowrap'>
                                <i className="material-icons md-icon-small">info_outline</i>
                                Payment recipient requires Memo entry!
                            </div>
                            <div>
                                <span className="p-r">
                                    <RaisedButton
                                        onClick={this.sendPayment.bind(this)}
                                        backgroundColor="rgb(15,46,83)"
                                        labelColor="rgb(244,176,4)"
                                        label="SIGN"
                                        disabledLabelColor="#cfd8dc"
                                        disabled={this.state.buttonSendDisabled}
                                    />
                                </span>
                                <FlatButton
                                    label="CANCEL"
                                    disableTouchRipple={true}
                                    disableFocusRipple={true}
                                    labelStyle={{ color: "rgb(15,46,83)", }}
                                    onClick={this.handleOpen.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="p-b"></div>
                    </CardActions>
                </Card>
            

      </div>
    )
  }
}


// ...
function mapStateToProps (state) {
    return {
        accountInfo: state.accountInfo,
        auth: state.auth,
        modal: state.modal,
    }
}


// ...
function matchDispatchToProps (dispatch) {
    return bindActionCreators({
        setExchangeRate,
        showAlert,
        hideAlert,
        setCurrency,
        setStreamer,
        setCurrencyPrecision,
        accountExistsOnLedger,
        accountMissingOnLedger,
    }, dispatch)
}


// ...
export default connect(mapStateToProps, matchDispatchToProps)(Balances)
