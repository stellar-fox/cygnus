import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import ReducedContactSuggester from "./ReducedContactSuggester"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import { CircularProgress, Typography } from "@material-ui/core"
import { action as BalancesAction } from "../../redux/Balances"
import {
    loadAccount,
    buildAssetPaymentTx,
    submitTransaction,
} from "../../lib/stellar-tx"

// ...
export default compose(
    connect(
        // map state to props.
        (state) => ({
            asset: state.Assets.selected,
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
            amount: state.Balances.amount,
            payee: state.Balances.payee,
            horizon: state.StellarAccount.horizon,
            publicKey: state.StellarAccount.accountId,
            memoText: state.Balances.memoText,

        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
        }, dispatch)
    ),
    withStyles((theme) => ({
        root: theme.mixins.gutters({
            paddingTop: 16,
            paddingBottom: 16,
            minWidth: 250,
            backgroundColor: theme.palette.secondary.main,
            opacity: "0.7",
        }),

        avatar: {
            borderRadius: 3,
            width: 48,
            height: 48,
            border: `1px solid ${theme.palette.secondary.dark}`,
        },

    }))
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            error: false,
            errorMessage: "",
            inProgress: false,
        }


        // ...
        // ...
        updateInputValue = (event) => {
            if (!/^(\d+)([.](\d{1,2}))?$/.test(event.target.value)) {
                this.setState({
                    error: true,
                    errorMessage: "Invalid amount entered.",
                })
                this.props.setState({ amount: "", })
            } else {
                this.setState({
                    error: false,
                    errorMessage: "",
                })
                this.props.setState({ amount: event.target.value, })
            }
        }


        // ...
        disableButton = () => {
            if (this.props.amount && this.props.payee) {
                return false
            }
            return true
        }


        // ...
        sendAsset = async () => {

            const paymentData = {
                source: this.props.publicKey,
                destination: this.props.payee,
                amount: this.props.amount,
                memo: this.props.memoText,
                network: this.props.horizon,
                assetCode: this.props.asset.asset_code,
                assetIssuer: this.props.asset.asset_issuer,
            }

            const account = await loadAccount(
                this.props.payee, this.props.horizon
            )

            let tx = await buildAssetPaymentTx(paymentData)

            console.log(account)
            console.log(tx)
        }


        // ...
        render = () => (
            ({ classes, asset, }) =>
                <Fragment>
                    {asset &&
                        <div className="p-t flex-box-col items-flex-start">
                            <Typography variant="title" color="primary">
                                Pay with {asset.asset_code} to:
                            </Typography>
                            <ReducedContactSuggester />
                            <InputField
                                id="payment-amount"
                                type="text"
                                label="Amount"
                                color="primary"
                                error={this.state.error}
                                errorMessage={this.state.errorMessage}
                                onChange={this.updateInputValue}
                            />
                            <Button
                                color="primary"
                                onClick={this.sendAsset}
                                disabled={this.props.amount === "" || !this.props.payee}
                            >
                                {this.state.inProgress ? <CircularProgress
                                    color="primary" thickness={4} size={20}
                                /> : "Sign"}
                            </Button>
                        </div>
                    }
                </Fragment>
        )(this.props)
    }
)
