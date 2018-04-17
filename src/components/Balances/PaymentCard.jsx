import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
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
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import InputField from "../../lib/common/InputField"
import DatePicker from "material-ui/DatePicker"
import {
    togglePaymentCard,
} from "../../redux/actions"
import { action as BalancesAction } from "../../redux/Balances"
import {
    federationAddressValid,
    fedToPub,
    htmlEntities as he,
    invalidPaymentAddressMessage,
    publicKeyValid,
    publicKeyExists,
} from "../../lib/utils"




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
            minimumReserveMessage: "",
            sendEnabled: false,
            indicatorMessage: "XXXXXXXXXXXX",
            indicatorStyle: "fade-extreme",
            error: "",
        })
    }


    // ...
    setRecipient = async () => {
        // read user entered input from payment address field
        // set initial public key to null
        let
            input = this.textInputFieldPaymentAddress.state.value,
            publicKey = null

        // check user's input for valid federation address format
        if (federationAddressValid(input)) {
            // user has entered a valid federation address so convert it
            // to public key so it can be used as payment destination
            try {
                publicKey = await fedToPub(input)
            } catch (ex) {
                if (!ex.response) {
                    this.textInputFieldPaymentAddress.setState({
                        error: "Service not found at this domain.",
                    })
                } else if (ex.response.status === 404) {
                    this.textInputFieldPaymentAddress.setState({
                        error: "Recipient not found.",
                    })
                } else {
                    this.textInputFieldPaymentAddress.setState({
                        error: ex.message,
                    })
                }
            }

        // user did not enter a valid federation address but we also accept
        // a valid public key at this time
        } else if (publicKeyValid(input)) {
            publicKey = input
        }

        // at this point we have a valid public key that we can set as
        // payment destination address
        if (publicKey) {
            // check if this public key already exists on Stellar network
            // and based on the outcome set appropriate transaction type
            if (await publicKeyExists(publicKey)) {

                this.setTransactionType("EXISTING_ACCOUNT")
                this.updateIndicatorMessage("Recipient Verified", "green")

            } else {

                this.setTransactionType("NEW_ACCOUNT")
                this.updateIndicatorMessage("New Account", "red")

            }

            this.setPaymentDestination(publicKey, input)

            this.memoValidator()

            this.toggleSignButton()
        }
    }


    // ...
    setTransactionType = (tt) =>
        this.props.setState({ newAccount: tt === "NEW_ACCOUNT", })


    // ...
    setPaymentDestination = (pk, input) =>
        this.props.setState({
            payee: pk,
            payeeAddress: input,
        })


    // ...
    setInvalidPaymentAddressMessage = (errorMessage) => {
        this.textInputFieldPaymentAddress.setState({ error: errorMessage, })
        this.props.setState({
            indicatorMessage: "XXXXXXXXXXXX",
            indicatorStyle: "fade-extreme",
        })
    }


    // ...
    resetPayee = () => this.props.setState({ payee: null, })


    // ...
    updateIndicatorMessage = (message, style) =>
        this.props.setState({
            indicatorMessage: message,
            indicatorStyle: style,
        })


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
    paymentAddressValidator = () => {
        let errorMessage = invalidPaymentAddressMessage(
            this.textInputFieldPaymentAddress.state.value
        )

        if (errorMessage) {
            this.setInvalidPaymentAddressMessage(errorMessage)
            this.resetPayee()
        }

        this.textInputFieldPaymentAddress.setState({ error: "", })
        this.setRecipient()
    }


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
    memoValid = () => {
        if (this.props.Balances.memoRequired &&
            this.textInputFieldMemo.state.value === "") {
            return false
        }
        return true
    }


    // ...
    memoValidator = () => {
        this.props.setState({
            memoText: this.textInputFieldMemo.state.value,
            error: this.memoValid() ?
                "" : "Memo is required for this payee.",
        })
        this.toggleSignButton()
    }


    // ...
    hidePaymentCard = () =>
        this.props.togglePaymentCard({
            payment: {
                opened: false,
            },
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
                        onChange={this.updateDate}
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
                        <div
                            className="p-r leading-label-align payment-currency"
                        >
                            {
                                this.props.assetManager.getAssetGlyph(
                                    this.props.Account.currency
                                )
                            }
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
                                this.props.Balances.amountText :
                                <span className="transparent">NOTHING</span>
                        }
                    </div>
                    <div>
                        {
                            this.props.assetManager.getAssetDenomination(
                                this.props.Account.currency
                            )
                        }
                    </div>
                </div>
                <div className="p-t"></div>
                <div className="f-e">
                    <div>
                        <i className="material-icons">lock</i>
                    </div>
                    <div className="micro nowrap">
                        <span>Security Features</span><br />
                        <span className={this.props.Balances.indicatorStyle}>
                            {this.props.Balances.indicatorMessage}
                        </span>

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

                    {
                        this.props.Balances.error ?
                            <div className="p-l nowrap red">
                                <i className="material-icons md-icon-small">
                                    warning
                                </i>
                                {this.props.Balances.error}
                            </div> :
                            <div className="p-l nowrap fade-extreme">
                                <span className="bigger">
                                    <he.SL /><he.Space />
                                    {this.props.StellarAccount.sequence}
                                </span>
                            </div>
                    }

                    <div>
                        <span className="p-r">
                            <RaisedButton
                                onClick={this.props.onSignTransaction}
                                backgroundColor="rgb(15,46,83)"
                                labelColor="rgb(244,176,4)"
                                label="SIGN"
                                disabledBackgroundColor="rgba(15,46,83,0.3)"
                                disabledLabelColor="#cfd8dc"
                                disabled={!this.props.Balances.sendEnabled}
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
export default compose(
    withLoginManager,
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({
            Account: state.Account,
            Assets: state.Assets,
            Balances: state.Balances,
            StellarAccount: state.StellarAccount,
            appUi: state.appUi,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
            togglePaymentCard,
        }, dispatch)
    )
)(PaymentCard)
