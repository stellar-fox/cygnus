import React, { Component, Fragment } from "react"
import { withStyles } from "@material-ui/core/styles"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { emptyString } from "@xcmats/js-toolbox"
import ReducedContactSuggester from "./ReducedContactSuggester"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import { CircularProgress, Typography } from "@material-ui/core"
import { action as BalancesAction } from "../../redux/Balances"
import { action as ModalAction } from "../../redux/Modal"
import {
    loadAccount,
    buildAssetPaymentTx,
    assetBalance,
    submitTransaction,
} from "../../lib/stellar-tx"
import {
    insertPathIndex,
    htmlEntities as he,
    StellarSdk,
} from "../../lib/utils"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import clone from "lodash/clone"




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
            memoText: state.Balances.memoText,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            transactionAsset: state.Balances.transactionAsset,

        }),
        // match dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
            resetState: BalancesAction.resetState,
            showModal: ModalAction.showModal,
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
        state = {
            error: false,
            errorMessage: emptyString(),
            inProgress: false,
            statusMessage: emptyString(),
        }


        // ...
        componentDidMount = () => {
            this.props.resetState()
        }


        // ...
        updateInputValue = (event) => {
            if (!/^(\d+)([.](\d{1,2}))?$/.test(event.target.value)) {
                this.setState({
                    error: true,
                    errorMessage: "Invalid amount entered.",
                })
                this.props.setState({
                    amount: emptyString(),
                    transactionAsset: null,
                })
            } else {
                this.setState({
                    error: false,
                    errorMessage: emptyString(),
                })
                this.props.setState({
                    amount: event.target.value,
                    transactionAsset: clone(this.props.asset),
                })
            }
        }


        // ...
        sendAsset = async () => {

            this.setState({
                inProgress: true,
                statusMessage: "Fetching account info ...",
            })

            let availableAssetBalance = null

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

            const asset = new StellarSdk.Asset(
                this.props.asset.asset_code,
                this.props.asset.asset_issuer
            )

            try {
                availableAssetBalance = assetBalance(account, asset)
            } catch (error) {
                this.setState({
                    inProgress: false,
                    statusMessage: error.message,
                })
                return Promise.reject({
                    error: true, message: error.message,
                })
            }

            if (availableAssetBalance) {
                let tx = await buildAssetPaymentTx(paymentData)

                this.setState({
                    statusMessage: "Waiting for device ...",
                })

                try {
                    await getSoftwareVersion()

                    this.setState({
                        statusMessage: "Awaiting signature ...",
                    })

                    const signedTx = await signTransaction(
                        insertPathIndex(this.props.bip32Path),
                        this.props.publicKey,
                        tx
                    )

                    this.setState({
                        statusMessage: "Sending transaction ...",
                    })

                    const broadcast = await submitTransaction(
                        signedTx, this.props.horizon
                    )

                    await this.props.setState({
                        paymentId: broadcast.hash,
                        ledgerId: broadcast.ledger,
                        transactionType: null,
                    })

                    await this.setState({
                        inProgress: false,
                        statusMessage: emptyString(),
                    })

                    this.props.showModal("txCustomAssetComplete")


                } catch (error) {
                    this.setState({
                        inProgress: false,
                        statusMessage: error.message,
                    })
                    return Promise.reject({
                        error: true, message: error.message,
                    })
                }

            }

            return Promise.resolve({ ok: true, })
        }



        // ...
        render = () => (
            ({ asset, assetManager, }) =>
                <Fragment>
                    {asset &&
                        <div className="p-t flex-box-col items-flex-start">
                            <Typography variant="subheading" color="primary">
                            Send {assetManager.getAssetDescription(
                                    asset.asset_code.toLowerCase()
                                )} to:
                            </Typography>
                            <ReducedContactSuggester />
                            <InputField
                                id="payment-amount"
                                type="text"
                                label={`${
                                    assetManager.getAssetGlyph(
                                        asset.asset_code.toLowerCase()
                                    )
                                } Amount`}
                                color="primary"
                                error={this.state.error}
                                errorMessage={this.state.errorMessage}
                                onChange={this.updateInputValue}
                            />
                            <Button
                                color="primary"
                                onClick={this.sendAsset}
                                disabled={this.props.amount === emptyString() || !this.props.payee}
                            >
                                {this.state.inProgress ? <CircularProgress
                                    color="secondary" thickness={4} size={20}
                                /> : "Sign"}
                            </Button>
                            <Typography variant="caption" color="primary">
                                {this.state.statusMessage ?
                                    this.state.statusMessage : <he.Nbsp />
                                }
                            </Typography>
                        </div>
                    }
                </Fragment>
        )(this.props)
    }
)
