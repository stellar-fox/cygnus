import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import numberToText from "number-to-text"
import debounce from "lodash/debounce"
import { BigNumber } from "bignumber.js"

import {
    Card,
    CardActions,
    CardText,
} from "material-ui/Card"
import DatePicker from "material-ui/DatePicker"

import {
    federationAddressValid,
    getFederationRecord,
    htmlEntities as he,
    invalidPaymentAddressMessage,
    publicKeyValid,
    signatureValid,
} from "../../lib/utils"
import { appName, securityMsgPlaceholder, } from "../StellarFox/env"
import { loadAccount } from "../../lib/stellar-tx"

import Button from "../../lib/mui-v1/Button"
import InputField from "../../lib/common/InputField"

import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"

import { action as AccountAction } from "../../redux/Account"
import { action as BalancesAction } from "../../redux/Balances"

import sflogo from "../StellarFox/static/sf-logo.svg"
import ContactSuggester from "./ContactSuggester"




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

                /**
                 * public key returned by federation service that allegedly
                 * maps to the given federation address
                 */
                const federationRecord = await getFederationRecord(input)

                const memo = federationRecord.memo ? federationRecord.memo : ""

                /**
                 * stellar account corresponding to the public key that is
                 * currently mapped in to the federation address input
                 */
                const payeeStellarAccount = await loadAccount(
                    federationRecord.account_id,
                    this.props.StellarAccount.horizon
                )

                /**
                 * The following is a verification procedure for making sure
                 * that the recipient's info (the mapping of federation address
                 * to Stellar public key) is authentic.
                 */
                const paySig = payeeStellarAccount.data_attr ?
                    (payeeStellarAccount.data_attr.paySig ?
                        payeeStellarAccount.data_attr.paySig : null) : null


                if (paySig) {
                    if (signatureValid({
                        paymentAddress: federationRecord.stellar_address,
                        memo,
                    }, paySig)) {
                        this.setTransactionType("EXISTING_ACCOUNT")
                        this.updateIndicatorMessage(
                            "Payee Verified", "green"
                        )
                        memo.length > 0 &&
                            this.props.setState({
                                memoRequired: true,
                                payeeMemoText: memo,
                            })
                    } else {
                        this.setTransactionType("EXISTING_ACCOUNT")
                        this.updateIndicatorMessage(
                            "Wrong Signature", "red"
                        )
                        this.props.setState({
                            memoRequired: false,
                            payeeMemoText: "",
                        })
                    }
                } else {
                    this.setTransactionType("EXISTING_ACCOUNT")
                    this.updateIndicatorMessage("Payee Unverified", "yellow")
                    this.props.setState({
                        memoRequired: false,
                        payeeMemoText: "",
                    })
                }

                publicKey = federationRecord.account_id

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
            try {
                const payeeStellarAccount = await loadAccount(
                    publicKey,
                    this.props.StellarAccount.horizon
                )
                if (payeeStellarAccount.account_id === publicKey) {
                    this.setTransactionType("EXISTING_ACCOUNT")
                    this.updateIndicatorMessage("Existing Account", "green")
                }

            } catch (error) {
                if (error.name === "NotFoundError") {
                    this.setTransactionType("NEW_ACCOUNT")
                    this.updateIndicatorMessage("New Account", "yellow")
                }
            }
        }

        /**
         * At this point we have a valid and verified Stellar public key
         * that we can set as payment destination.
         */
        if (publicKey) {
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
            indicatorMessage: securityMsgPlaceholder,
            indicatorStyle: "fade-extreme",
            memoText: "",
            payeeMemoText: "",
            memoRequired: false,
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
            return
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
            this.props.Balances.memoText === "") {
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
    withLoginManager,
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({
            Account: state.Account,
            Assets: state.Assets,
            Balances: state.Balances,
            StellarAccount: state.StellarAccount,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
            setStateForAccount: AccountAction.setState,
        }, dispatch)
    )
)(PaymentCard)
