import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import PropTypes from "prop-types"
import numberToText from "number-to-text"
import debounce from "lodash/debounce"
import { BigNumber } from "bignumber.js"
import { Card, CardActions, CardText } from "material-ui/Card"
import DatePicker from "material-ui/DatePicker"
import { htmlEntities as he } from "../../lib/utils"
import { appName, securityMsgPlaceholder, } from "../StellarFox/env"
import Button from "../../lib/mui-v1/Button"
import InputField from "../../lib/common/InputField"
import { withAssetManager } from "../AssetManager"
import { action as BalancesAction } from "../../redux/Balances"
import sflogo from "../StellarFox/static/sf-logo.svg"
import ContactSuggester from "./ContactSuggester"
import { Typography } from "@material-ui/core"




// <PaymentCard> component
class PaymentCard extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    componentDidMount = () => {
        // reset payment variables
        const now = new Date()
        this.props.setState({
            today: now,
            payDate: now,
            amount: "",
            amountText: "",
            amountIsValid: false,
            payee: null,
            newAccount: false,
            memoRequired: false,
            memoText: "",
            payeeMemoText: "",
            payeeCurrency: "eur",
            payeeCurrencyAmount: "",
            minimumReserveMessage: "",
            sendEnabled: false,
            cancelEnabled: true,
            message: null,
            indicatorMessage: securityMsgPlaceholder,
            indicatorStyle: "fade-extreme",
            error: "",
        })
    }


    // ...
    resetPayee = () => this.props.setState({ payee: null, })


    // ...
    updateDate = (date) => this.props.setState({ payDate: date, })


    // ...
    paymentValid = () =>
        this.props.Balances.payee  &&
        this.props.Balances.amountIsValid  &&
        this.memoValid()


    // ...
    toggleSignButton = () =>
        this.paymentValid() ?
            this.enableSignButton() : this.disableSignButton()


    // ...
    enableSignButton = () => this.props.setState({ sendEnabled: true, })


    // ...
    disableSignButton = () => this.props.setState({ sendEnabled: false, })


    // ...
    amountValidator = () => {
        if (
            !/^(\d+)([.](\d{1,2}))?$/.test(
                this.textInputFieldAmount.state.value
            )
        ) {
            this.textInputFieldAmount.setState({
                error: "Invalid amount entered.",
            })
            this.props.setState({
                amount: "",
                amountIsValid: false,
                amountText: "",
            })
            this.toggleSignButton()
            return false
        }

        BigNumber.config({ DECIMAL_PLACES: 4, ROUNDING_MODE: 4, })
        const amountAsBigNumber = new BigNumber(
            this.textInputFieldAmount.state.value)
        const amount = amountAsBigNumber.toFixed(2)

        if (amountAsBigNumber.isEqualTo(0)) {
            this.textInputFieldAmount.setState({
                error: "Amount needs to be greater than zero.",
            })
            this.props.setState({
                amount: "",
                amountIsValid: false,
                amountText: "",
            })
            this.toggleSignButton()
            return false
        }

        /**
         * In case the selected contact has a different currency than then
         * sender, update the receiver currency and display appropriate rate
         * every time the amount is updated.
         */
        if (this.props.Account.currency !== this.props.Balances.payeeCurrency) {
            this.props.assetManager.updateExchangeRate(
                this.props.Balances.payeeCurrency
            ).then(() => {
                this.props.setState({
                    payeeCurrencyAmount: this.props.assetManager.convertToPayeeCurrency(
                        this.props.Balances.amountNative
                    ),
                })
            })
        }

        // amount is a valid positive number with fixed precision of 2 decimals
        this.props.setState({
            amount,
            amountNative: this.props.assetManager.convertToNative(amount),
            amountIsValid: true,
        })

        this.textInputFieldAmount.setState({ error: "", })

        this.props.setState({ amountText: this.amountToText(amount), })

        this.toggleSignButton()
    }


    // ...
    amountToText = (amount) => {
        const grouped = amount.match(
            /^(\d+)([.](\d{1,2}))?$/
        )
        // amount with fractions case
        if (grouped[3]) {
            return `${numberToText.convertToText(grouped[1])} and ${
                grouped[3]}/100`
        }
        // whole amount case
        else if (grouped[1] && !grouped[2]) {
            return numberToText.convertToText(grouped[1])
        }
    }


    // ...
    displayPayeeAmount = () =>
        this.props.Balances.amount ? (() => {
            return `${this.props.Balances.payeeCurrencyAmount ?
                this.props.Balances.payeeCurrencyAmount : "0.00"
            } ${this.props.assetManager.getAssetDescription(
                this.props.Balances.payeeCurrency
            )}`
        })() : null


    // ...
    memoValid = () => {
        if (this.props.Balances.memoRequired &&
            !this.props.Balances.memoText &&
            !this.props.Balances.payeeMemoText) {
            return false
        }
        return true
    }


    // ...
    memoValidator = () => {
        this.props.setState({
            memoText: this.props.Balances.payeeMemoText.length > 0 ?
                this.props.Balances.payeeMemoText :
                this.textInputFieldMemo.state.value,
        })
        this.toggleSignButton()
    }


    // ...
    hidePaymentCard = () => this.props.setState({
        payCardVisible: false,
    })


    // ...
    render = () =>
        <Card className="payment-card">
            <CardText>
                <div className="f-e space-between">
                    <div>
                        <div>
                            <img
                                style={{ opacity: "0.2", }}
                                src={sflogo}
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
                        onChange={this.updateDate}
                    />
                </div>
                <div className="f-s space-between">
                    <div className="payment-header f-s">
                        <div className="p-r leading-label-align nowrap">
                            Pay to the order of:
                        </div>
                        <div className="p-r">
                            <ContactSuggester />
                        </div>

                    </div>
                    <div className="payment-header f-s">
                        <div
                            className="p-r leading-label-align payment-currency"
                        >
                            {this.props.assetManager.getAssetGlyph(
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
                        {
                            this.props.Balances.amount  &&
                            this.props.Balances.amountText ?
                                this.props.Balances.amount  &&
                                this.props.Balances.amountText : <he.Nbsp />
                        }
                    </div>
                    <div>

                        <Typography variant="body1" align="right"
                            noWrap
                        >
                            {this.props.assetManager.getAssetDenomination(
                                this.props.Account.currency
                            )}
                            <he.Nbsp /><he.Nbsp />
                            <span className="tiny text-primary fade-strong">
                                {this.props.Account.currency !==
                                this.props.Balances.payeeCurrency &&
                                    this.displayPayeeAmount()
                                }
                            </span>
                        </Typography>
                    </div>
                </div>
                <div className="p-t"></div>
                <div className="f-e">
                    <div>
                        <i className="material-icons">lock</i>
                    </div>
                    <div className="f-b-col center">
                        <div className="micro nowrap p-r-small">
                            Security Features
                        </div>
                        <div className="micro nowrap">
                            <span className={this.props.Balances.indicatorStyle}>
                                {this.props.Balances.indicatorMessage}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-t f-b space-between">
                    {this.props.Balances.payeeMemoText.length === 0 ?
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
                                    maxLength={28}
                                />
                            </span>
                        </div> :
                        <div
                            style={{
                                paddingTop: "41px",
                                fontSize: "1rem",
                                paddingBottom: "12px",
                            }}
                        >
                            <span className="p-r">For: </span>
                            <span
                                style={{
                                    color: "rgba(15,46,83,0.4)",
                                    paddingBottom: "4px",
                                    borderBottom: "1px solid rgba(15,46,83,0.4)",
                                }}
                            >
                                {this.props.Balances.payeeMemoText}
                                <he.Nbsp />
                                <span className="micro text-primary fade-extreme">
                                    (payee custom defined memo)
                                </span>
                            </span>
                        </div>
                    }
                </div>
            </CardText>
            <CardActions>
                <div className="f-e space-between">
                    <div className="p-l nowrap fade-extreme">
                        <span className="bigger">
                            <he.SL /><he.Space />
                            {this.props.StellarAccount.sequence}
                        </span>
                    </div>
                    <div>
                        <Button
                            onClick={this.props.onSignTransaction}
                            color="danger"
                            disabled={!this.props.Balances.sendEnabled}
                        >Sign</Button>
                        <Button
                            onClick={this.hidePaymentCard}
                            color="primary"
                            disabled={!this.props.Balances.cancelEnabled}
                        >Cancel</Button>
                    </div>
                </div>

            </CardActions>
            <div className="f-e p-b-small tiny">{
                this.props.Balances.message ?
                    this.props.Balances.message : <he.Nbsp />
            }</div>
        </Card>

}


// ...
export default compose(
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({
            Account: state.Account,
            Balances: state.Balances,
            StellarAccount: state.StellarAccount,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
        }, dispatch)
    )
)(PaymentCard)
