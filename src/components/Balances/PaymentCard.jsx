import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import PropTypes from "prop-types"
import { string } from "@xcmats/js-toolbox"
import { BigNumber } from "bignumber.js"
import {
    Card,
    CardActions,
    CardText,
} from "material-ui/Card"
import {
    amountToText,
    htmlEntities as he,
} from "../../lib/utils"
import {
    appName,
    securityMsgPlaceholder,
} from "../StellarFox/env"
import Button from "../../lib/mui-v1/Button"
import { withAssetManager } from "../AssetManager"
import { action as BalancesAction } from "../../redux/Balances"
import sflogo from "../StellarFox/static/sf-logo.svg"
import ContactSuggester from "./ContactSuggester"
import {
    TextField,
    Typography,
} from "@material-ui/core"
import NumberFormat from "react-number-format"
import { withStyles } from "@material-ui/core/styles"
import { fade } from "@material-ui/core/styles/colorManipulator"




// <PaymentCard> component
class PaymentCard extends Component {

    // ...
    static propTypes = {
        setState: PropTypes.func.isRequired,
    }


    // ...
    state = {
        error: false,
        errorMessage: string.empty(),
    }


    // ...
    componentDidMount = () => {
        // reset payment variables
        const now = new Date()
        this.props.setState({
            today: now,
            payDate: now,
            amount: string.empty(),
            amountNative: string.empty(),
            amountText: string.empty(),
            amountIsValid: false,
            payee: null,
            newAccount: false,
            memoRequired: false,
            memoText: string.empty(),
            payeeMemoText: string.empty(),
            payeeCurrency: "eur",
            payeeCurrencyAmount: string.empty(),
            sendEnabled: false,
            cancelEnabled: true,
            message: null,
            indicatorMessage: securityMsgPlaceholder,
            indicatorStyle: "fade-extreme",
            error: string.empty(),
        })
    }


    // ...
    resetPayee = () => this.props.setState({ payee: null })


    // ...
    updateDate = (date) => this.props.setState({ payDate: date })


    // ...
    enableSignButton = () => this.props.setState({ sendEnabled: true })


    // ...
    disableSignButton = () => this.props.setState({ sendEnabled: false })


    // ...
    amountValidator = (event) => {
        const inputValue = event.target.value

        if (!/^(\d+)([.](\d{1,2}))?$/.test(inputValue)) {
            this.setState({
                error: true,
                errorMessage: "Invalid amount entered.",
            })

            this.props.setState({
                amount: string.empty(),
                amountNative: string.empty(),
                amountIsValid: false,
                amountText: string.empty(),
            })
            this.disableSignButton()
            return false
        }

        BigNumber.config({ DECIMAL_PLACES: 4, ROUNDING_MODE: 4 })
        const amountAsBigNumber = new BigNumber(inputValue)
        const amount = amountAsBigNumber.toFixed(2)

        if (amountAsBigNumber.isEqualTo(0)) {
            this.setState({
                error: true,
                errorMessage: "Amount needs to be greater than zero.",
            })
            this.props.setState({
                amount: string.empty(),
                amountNative: string.empty(),
                amountIsValid: false,
                amountText: string.empty(),
            })
            this.disableSignButton()
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
                    payeeCurrencyAmount:
                        this.props.assetManager.convertToPayeeCurrency(
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

        this.setState({
            error: false,
            errorMessage: string.empty(),
        })

        this.props.setState({
            amountText: amountToText(amount),
            transactionAsset: { asset_code: this.props.Account.currency },
        })

        this.enableSignButton()
    }




    // ...
    displayPayeeAmount = () =>
        this.props.Balances.amount && (() =>
            <Fragment>
                <NumberFormat
                    value={new BigNumber(
                        this.props.Balances.payeeCurrencyAmount ?
                            this.props.Balances.payeeCurrencyAmount : "0.00"
                    ).toFixed(2)}
                    displayType={"text"} thousandSeparator={true}
                    decimalScale={2}
                    fixedDecimalScale={true}
                /><he.Nbsp />
                <span>
                    {this.props.assetManager.getAssetDescription(
                        this.props.Balances.payeeCurrency
                    )}
                </span>
            </Fragment>
        )()





    // ...
    memoValidator = (event) => {
        const memoValue = event.target.value

        this.props.setState({
            memoText: this.props.Balances.payeeMemoText.length > 0 ?
                this.props.Balances.payeeMemoText :
                memoValue,
        })
    }




    // ...
    hidePaymentCard = () => this.props.setState({
        payCardVisible: false,
    })




    // ...
    render = () =>
        <Card className="payment-card">
            <CardText>
                <div className="flex-box-row space-between">
                    <div>
                        <div>
                            <img
                                style={{ opacity: "0.2" }}
                                src={sflogo}
                                width="140px"
                                alt={appName}
                            />
                        </div>

                    </div>
                    <TextField
                        id="date"
                        label="Date"
                        type="text"
                        disabled
                        defaultValue={
                            new Date(
                                this.props.Balances.today
                            ).toLocaleDateString()
                        }
                        className="date-picker"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            classes: {
                                disabled: this.props.classes.disabled,
                            },
                        }}
                    />
                </div>


                <div className="m-t-medium flex-box-row space-between">

                    <div className="flex-box-row">
                        <div className="pay-to-the-order-of">
                            Pay to the order of:
                        </div>
                        <div>
                            <ContactSuggester />
                        </div>
                    </div>

                    <div className="flex-box-row">
                        <div className="currency-glyph">
                            {this.props.assetManager.getAssetGlyph(
                                this.props.Account.currency
                            )}
                        </div>
                        <div>
                            <TextField
                                autoComplete="off"
                                InputProps={{
                                    classes: {
                                        underline: this.props.classes.underline,
                                    },
                                    inputProps: {
                                        maxLength: 10,
                                    },
                                }}

                                error={this.state.error}
                                helperText={this.state.errorMessage}
                                name="paycheck-payment-amount"
                                type="text"
                                onChange={this.amountValidator}
                            />
                        </div>
                    </div>

                </div>


                <div className="m-t-medium flex-box-row space-between verbatim-underlined">
                    <div>
                        {
                            this.props.Balances.amount  &&
                            this.props.Balances.amountText ?
                                this.props.Balances.amount  &&
                                this.props.Balances.amountText : <he.Nbsp />
                        }
                    </div>
                    <div className="flex-box-row items-flex-end content-flex-end">
                        <Typography color="primary" noWrap>
                            {this.props.assetManager.getAssetDenomination(
                                this.props.Account.currency
                            )}
                        </Typography>
                        <Typography color="primary" noWrap>
                            <span className="p-l fade-strong">
                                {this.props.Account.currency !==
                                this.props.Balances.payeeCurrency &&
                                    this.displayPayeeAmount()
                                }
                            </span>
                        </Typography>
                    </div>
                </div>


                <div className="m-t flex-box-row content-flex-end">
                    <div className="padlock-icon">
                        {this.props.Balances.indicatorMessage === "Payee Verified" ?
                            <i style={{ color: "rgb(27, 94, 32)" }}
                                className="material-icons"
                            >lock</i> :
                            <i className="material-icons">lock_open</i>
                        }
                    </div>
                    <div className="flex-box-col content-centered">
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

                <div className="m-t-medium flex-box-row">

                    <div className="memo-for">For:</div>
                    <div>
                        {this.props.Balances.payeeMemoText.length === 0 ?
                            <TextField
                                autoComplete="off"
                                InputProps={{
                                    classes: {
                                        underline: this.props.classes.underline,
                                    },
                                    inputProps: {
                                        maxLength: 28,
                                    },
                                }}

                                name="paycheck-payment-amount"
                                type="text"
                                onChange={this.memoValidator}
                            /> :
                            <div
                                style={{
                                    color: "rgba(15,46,83,0.4)",
                                    paddingBottom: "4px",
                                    borderBottom: "1px solid rgba(15,46,83,0.4)",
                                }}
                                className="custom-memo"
                            >
                                {this.props.Balances.payeeMemoText}
                                <he.Nbsp />
                                <span className="micro text-primary fade-extreme">
                                    (payee custom defined memo)
                                </span>
                            </div>
                        }
                    </div>

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
                            color="success"
                            disabled={!this.props.Balances.sendEnabled}
                        >Sign & Send</Button>
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
    withStyles((theme) => ({
        underline: {
            color: theme.palette.primary.main,
            "&:hover:before": {
                borderBottomColor: `${theme.palette.primary.main} !important`,
                borderBottomWidth: "1px !important",
            },
            "&:before": {
                borderBottomColor: fade(theme.palette.primary.main, 0.5),
            },
            "&:after": {
                borderBottomColor: theme.palette.primary.main,
            },
        },
        disabled: {
            borderBottomStyle: "none !important",
            color: theme.palette.primary.main,
            "&:before": {
                borderBottomColor: fade(theme.palette.primary.main, 0.5),
                borderBottomWidth: "1px !important",
                borderBottomStyle: "none !important",
            },
            "&:after": {
                borderBottomColor: theme.palette.primary.main,
                borderBottomWidth: "1px !important",
                borderBottomStyle: "none !important",
            },
        },
    })),
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
