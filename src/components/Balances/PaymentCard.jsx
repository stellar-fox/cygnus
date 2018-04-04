import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import numberToText from "number-to-text"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import debounce from "lodash/debounce"
import { appName } from "../StellarFox/env"
import { BigNumber } from "bignumber.js"
import {
    Card,
    CardActions,
    CardText,
} from "material-ui/Card"
import {
    currencyGlyph,
} from "../../lib/utils"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import InputField from "../../lib/common/InputField"
import DatePicker from "material-ui/DatePicker"
import {
    togglePaymentCard,
} from "../../redux/actions"
import { action as BalancesAction } from "../../redux/Balances"
import {
    fedToPub,
    errorMessageForInvalidPaymentAddress as ErrorPaymentAddress,
    StellarSdk,
} from "../../lib/utils"

BigNumber.config({ DECIMAL_PLACES: 4, ROUNDING_MODE: 4, })

StellarSdk.Network.useTestNetwork()

class PaymentCard extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    paymentAddressValidator = () => {
        let error = ErrorPaymentAddress(
            this.textInputFieldPaymentAddress.state.value
        )
        error ?
            this.textInputFieldPaymentAddress.setState({ error, }) :
            this.textInputFieldPaymentAddress.setState({ error: "", })

        !error ? this.setRecipient() : this.props.setState({ payee: null, })
    }


    // ...
    setRecipient = () => {
        fedToPub(this.textInputFieldPaymentAddress.state.value)
            .then(r => {
                r.ok ? this.props.setState({
                    payee: r.publicKey,
                }) : this.props.setState({
                    payee: null,
                })
            })
    }


    // ...
    amountValidator = () => {
        if (!/^(\d+)([.](\d{1,2}))?$/.test(this.textInputFieldAmount.state.value)) {
            this.textInputFieldAmount.setState({
                error: "Invalid amount entered.",
            })
            this.props.setState({
                amount: this.textInputFieldAmount.state.value,
                amountWasEntered: true,
                amountIsValid: false,
            })
            return false
        }
        this.props.setState({
            amount: this.textInputFieldAmount.state.value,
            amountWasEntered: true,
            amountIsValid: true,
        })
        this.textInputFieldAmount.setState({
            error: "",
        })
        this.amountToText()
    }


    // ...
    amountToText = () => {
        let amount = this.textInputFieldAmount.state.value.match(
            /^(\d+)([.](\d{1,2}))?$/
        )
        if (amount) {
            // fractions case
            if (amount[3]) {
                this.props.setState({
                    amount: `${amount[1]}.${amount[3]}`,
                    amountText: `${numberToText.convertToText(
                        amount[1])} and ${amount[3]}/100`,
                })
            }
            // whole amount case
            else {
                this.props.setState({
                    amount: `${amount[1]}`,
                    amountText: numberToText.convertToText(amount[1]),
                })
            }
            // common properties for valid amount
            this.props.setState({
                amountWasEntered: true,
                amountIsValid: true,
            })
        }
    }


    // ...
    memoValidator = () => {
        this.props.setState({
            memoValid: this.props.Balances.memoRequired &&
                this.textInputFieldMemo.state.value === "" ? false : true,
        })
    }


    // ...
    recipientIndicatorMessage = () => {
        let message = <span className="fade-extreme">XXXXXXXXXXXX</span>

        if (this.props.Balances.payee) {
            message = <span className="green">Recipient Verified</span>
        }

        if (this.props.Balances.newAccount) {
            message = <span className="red">New Account</span>
        }

        return message
    }


    // ...
    bottomIndicatorMessage = () => {
        let message = (<div className="p-l nowrap fade-extreme">
            <span className="bigger">
                𝕊𝕃{" "}{this.props.strAccount && this.props.strAccount.sequence}
            </span>
        </div>)

        if (this.props.Balances.memoRequired && !this.props.Balances.memoIsValid) {
            message = (<div className='fade p-l nowrap red'>
                <i className="material-icons md-icon-small">assignment_late</i>
                Payment recipient requires Memo entry!
            </div>)
        }

        if (this.props.Balances.minimumReserveMessage !== "") {
            message = (<div className='fade p-l nowrap red'>
                <i className="material-icons md-icon-small">assignment_late</i>
                {this.props.Balances.minimumReserveMessage}
            </div>)
        }

        return message
    }


    // ...
    updateDate = (_, date) =>
        this.props.setState({ payDate: date, })


    // ...
    hidePaymentCard = () =>
        this.props.togglePaymentCard({
            payment: {
                opened: false,
            },
        })


    // ...
    render = () => <Card className="payment-card">
        <CardText>
            <div className="f-e space-between">
                <div>
                    <div>
                        <img
                            style={{
                                opacity: "0.2",
                            }}
                            src="/img/sf.svg"
                            width="140px"
                            alt={appName}
                        />
                    </div>

                </div>
                <DatePicker
                    className="date-picker"
                    defaultDate={new Date(this.props.Balances.today)}
                    floatingLabelText="Date"
                    minDate={new Date(this.props.Balances.today)}
                    underlineShow={true}
                    onChange={this.updateDate.bind(this)}
                />
            </div>
            <div className="f-s space-between">
                <div className="payment-header f-s">
                    <div className="p-r leading-label-align nowrap">
                        Pay to the order of:
                    </div>
                    <div className="p-r">
                        <InputField
                            name="paycheck-payment-address"
                            type="text"
                            placeholder="Payment Address"
                            underlineStyle={{
                                borderColor: "rgba(15, 46, 83, 0.5)",
                            }}
                            underlineFocusStyle={{
                                borderColor: "rgba(15, 46, 83, 0.8)",
                            }}
                            inputStyle={{
                                color: "rgba(15, 46, 83, 0.8)",
                            }}
                            validator={
                                debounce(
                                    this.paymentAddressValidator,
                                    1000
                                )
                            }
                            ref={(self) => {
                                this.textInputFieldPaymentAddress = self
                            }}
                        />
                    </div>
                </div>
                <div className="payment-header f-s">
                    <div className="p-r leading-label-align payment-currency">
                        {currencyGlyph(
                            this.props.Account.currency
                        )}
                    </div>
                    <div>
                        <InputField
                            name="paycheck-payment-amount"
                            type="text"
                            validator={
                                debounce(this.amountValidator, 500)
                            }
                            ref={(self) => {
                                this.textInputFieldAmount = self
                            }}
                            placeholder="Amount"
                            underlineStyle={{
                                borderColor: "rgba(15, 46, 83, 0.5)",
                            }}
                            underlineFocusStyle={{
                                borderColor: "rgba(15, 46, 83, 0.8)",
                            }}
                            inputStyle={{
                                color: "rgba(15, 46, 83, 0.8)",
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="f-s space-between verbatim-underlined">
                <div>
                    {(this.props.Balances.amount && this.props.Balances.amountText) ?
                        (this.props.Balances.amount && this.props.Balances.amountText) :
                        <span className="transparent">NOTHING</span>}
                </div>
                <div>{this.props.assetManager.getAssetDenomination(this.props.Account.currency)}</div>
            </div>
            <div className="p-t"></div>
            <div className="f-e">
                <div>
                    <i className="material-icons">lock</i>
                </div>
                <div className="micro nowrap">
                    <span>Security Features</span><br />
                    {this.recipientIndicatorMessage.call(this)}

                </div>

            </div>
            <div className="p-b"></div>
            <div className="f-s space-between">
                <div>
                    <span className="payment-header">
                        <span className="p-r">For:</span>
                        <InputField
                            name="paycheck-memo"
                            type="text"
                            placeholder="Memo"
                            underlineStyle={{
                                borderColor: "rgba(15, 46, 83, 0.5)",
                            }}
                            underlineFocusStyle={{
                                borderColor: "rgba(15, 46, 83, 0.8)",
                            }}
                            inputStyle={{
                                color: "rgba(15, 46, 83, 0.8)",
                            }}
                            ref={(self) => {
                                this.textInputFieldMemo = self
                            }}
                            validator={
                                debounce(this.memoValidator, 500)
                            }
                        />
                    </span>
                </div>
            </div>
        </CardText>
        <CardActions>
            <div className="f-e space-between">

                {this.bottomIndicatorMessage.call(this)}

                <div>
                    <span className="p-r">
                        <RaisedButton
                            onClick={this.sendPayment}
                            backgroundColor="rgb(15,46,83)"
                            labelColor="rgb(244,176,4)"
                            label="SIGN"
                            disabledBackgroundColor="rgba(15,46,83,0.3)"
                            disabledLabelColor="#cfd8dc"
                            disabled={
                                this.props.Balances.sendIsDisabled
                            }
                        />
                    </span>
                    <FlatButton
                        label="CANCEL"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={this.hidePaymentCard}
                    />
                </div>
            </div>
            <div className="p-b"></div>
        </CardActions>
    </Card>
}


// ...
export default withLoginManager(withAssetManager(connect(
    // map state to props.
    (state) => ({
        Account: state.Account,
        Assets: state.Assets,
        Balances: state.Balances,
        strAccount: (state.accountInfo.account ? state.accountInfo.account.account : null),
        appUi: state.appUi,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setState: BalancesAction.setState,
        togglePaymentCard,

    }, dispatch)
)(PaymentCard)))