import React, { Component, Fragment } from "react"
import { withStyles } from "@material-ui/core/styles"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { Asset } from "stellar-sdk"
import { string } from "@xcmats/js-toolbox"
import ReducedContactSuggester from "./ReducedContactSuggester"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import { CircularProgress, Typography } from "@material-ui/core"
import { action as BalancesAction } from "../../redux/Balances"
import { action as ModalAction } from "../../redux/Modal"
import Avatar from "@material-ui/core/Avatar"
import {
    loadAccount,
    buildAssetPaymentTx,
    assetBalance,
    submitTransaction,
} from "../../lib/stellar-tx"
import {
    amountToText,
    insertPathIndex,
    htmlEntities as he,
} from "../../lib/utils"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import clone from "lodash/clone"
import BigNumber from "bignumber.js"
import NumberFormat from "react-number-format"




// ...
const styles = (theme) => ({
    root: {
        borderRadius: 3,
        width: 96,
        height: 96,
        minWidth: 0,
        border: `2px solid ${theme.palette.primary.fade}`,
        marginBottom: "3px",
        opacity: "0.95 !important",
    },
    img: {
        width: 96,
        height: 96,
        minWidth: 96,
        borderRadius: "5px",
        border: `3px solid ${theme.palette.secondary.light}`,
    },
})




// ...
export default compose(
    withStyles(styles),
    connect(
        // map state to props.
        (state) => ({
            asset: state.Assets.selected,
            userId: state.LoginManager.userId,
            token: state.LoginManager.token,
            amount: state.Balances.amount,
            amountText: state.Balances.amountText,
            indicatorMessage: state.Balances.indicatorMessage,
            indicatorStyle: state.Balances.indicatorStyle,
            payee: state.Balances.payee,
            payeeEmailMD5: state.Balances.payeeEmailMD5,
            payeeFullName: state.Balances.payeeFullName,
            payeeMemoText: state.Balances.payeeMemoText,
            horizon: state.StellarAccount.horizon,
            sequence: state.StellarAccount.sequence,
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
            hideModal: ModalAction.hideModal,
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

        img: {
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
            errorMessage: string.empty(),
            inProgress: false,
            statusMessage: string.empty(),
        }


        // ...
        componentDidMount = () => {
            this.props.resetState()
            this.setState({
                availableBalance: new BigNumber(
                    this.props.asset.balance
                ).toFixed(2),
            })
        }


        // ...
        updateInputValue = (event) => {

            const currentBalance = new BigNumber(this.props.asset.balance),
                availableBalance = new BigNumber(
                    this.props.asset.balance
                ).minus(event.target.value)


            if (!/^(\d+)([.](\d{0,2}))?$/.test(event.target.value)) {
                this.setState({
                    error: true,
                    errorMessage: "Invalid amount entered.",
                    availableBalance: currentBalance.toFixed(2),
                })
                this.props.setState({
                    amount: string.empty(),
                    amountText: string.empty(),
                    transactionAsset: null,
                })
            }
            else if (availableBalance.isLessThan(0)) {
                this.setState({
                    error: true,
                    errorMessage: "Not enough funds available.",
                    availableBalance: currentBalance.toFixed(2),
                })
                this.props.setState({
                    amount: string.empty(),
                    amountText: string.empty(),
                    transactionAsset: null,
                })
            }
            else if (availableBalance.isEqualTo(currentBalance)) {
                this.setState({
                    error: true,
                    errorMessage: "Amount needs to be greater than 0.00",
                    availableBalance: currentBalance.toFixed(2),
                })
                this.props.setState({
                    amount: string.empty(),
                    amountText: string.empty(),
                    transactionAsset: null,
                })
            }
            else {
                this.setState({
                    error: false,
                    errorMessage: string.empty(),
                    availableBalance: availableBalance.toFixed(2),
                })
                this.props.setState({
                    amount: event.target.value,
                    amountText: amountToText(
                        new BigNumber(event.target.value).toFixed(2)
                    ),
                    transactionAsset: clone(this.props.asset),
                })
            }
        }


        // ...
        updateMemoValue = (event) => this.props.setState({
            memoText: event.target.value,
        })


        // ...
        sendAsset = async () => {

            this.props.setState({
                cancelEnabled: false,
            })

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
                this.props.payee
            )

            const asset = new Asset(
                this.props.asset.asset_code,
                this.props.asset.asset_issuer
            )

            try {
                availableAssetBalance = assetBalance(account, asset)
            } catch (error) {
                this.props.setState({
                    cancelEnabled: true,
                })

                this.setState({
                    inProgress: false,
                    statusMessage: error.message,
                })
                return Promise.resolve({
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

                    const broadcast = await submitTransaction(signedTx)

                    await this.props.setState({
                        paymentId: broadcast.hash,
                        ledgerId: broadcast.ledger,
                        transactionType: null,
                    })

                    await this.setState({
                        inProgress: false,
                        statusMessage: string.empty(),
                    })

                    this.props.showModal("txCustomAssetComplete")


                } catch (error) {
                    this.props.setState({
                        cancelEnabled: true,
                    })

                    this.setState({
                        inProgress: false,
                        statusMessage: error.message,
                    })
                    return Promise.resolve({
                        error: true, message: error.message,
                    })
                }

            }

            this.props.setState({
                cancelEnabled: true,
            })

            return Promise.resolve({ ok: true })
        }



        // ...
        render = () => (
            ({ amount, amountText, asset, assetManager, indicatorMessage,
                indicatorStyle, payeeMemoText, sequence }) =>
                <Fragment>
                    {asset &&
                    <div className="flex-box-row items-centered">
                        <Avatar src={asset.avatar} /><he.Nbsp /><he.Nbsp />
                        <Typography variant="subtitle1" color="primary">
                            <span
                                style={{
                                    fontWeight: 600,
                                    textShadow: "0px 0px 2px rgba(15, 46, 83, 0.35)",
                                }}
                            >
                                {assetManager.getAssetDescription(
                                    asset.asset_code.toLowerCase()
                                )}
                            </span>
                        </Typography>
                    </div>
                    }

                    {asset &&
                    <div className="flex-box-row items-centered space-between">
                        <div style={{ minHeight: 116 }}>
                            <ReducedContactSuggester />
                        </div>
                        <div className="m-b-medium">
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
                            <Typography variant="caption" color="primary">
                                Available Balance:<he.Nbsp /><he.Nbsp />
                                {assetManager.getAssetGlyph(
                                    asset.asset_code.toLowerCase()
                                )} <NumberFormat
                                    value={this.state.availableBalance}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </Typography>
                        </div>
                    </div>
                    }

                    {asset &&
                    <div className="f-s space-between verbatim-underlined">
                        <div>
                            <Typography variant="body1" align="right" color="primary">
                                {amount && amountText ? amountText : <he.Nbsp />}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="body1" align="right" color="primary">
                                {this.props.assetManager.getAssetDenomination(
                                    asset.asset_code.toLowerCase()
                                )}
                            </Typography>
                        </div>
                    </div>
                    }

                    <div className="f-e p-t-small">
                        <div>
                            {indicatorMessage === "Payee Verified" ?
                                <i style={{ color: "rgb(27, 94, 32)" }}
                                    className="material-icons"
                                >lock</i> :
                                <i className="material-icons">lock_open</i>
                            }
                        </div>
                        <div className="f-b-col center">
                            <div className="micro nowrap p-r-small">
                                Security Features
                            </div>
                            <div className="micro nowrap">
                                <span className={indicatorStyle}>
                                    {indicatorMessage}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-box-row space-between items-centered">
                        {asset && payeeMemoText.length === 0 ?
                            <div className="flex-box-col">
                                <div className="p-t-large">
                                    <InputField
                                        name="paycheck-memo"
                                        type="text"
                                        label="Memo"
                                        color="primary"
                                        maxLength={28}
                                        onChange={this.updateMemoValue}
                                    />
                                </div>
                                <div className="nowrap fade-extreme">
                                    <he.SL /><he.Space />
                                    {sequence}
                                </div>
                            </div> :

                            <div className="flex-box-col">
                                <div className="m-t-x-large m-b-large">
                                    <span
                                        style={{
                                            color: "rgba(15,46,83,0.4)",
                                            paddingBottom: "4px",
                                            borderBottom: "1px solid rgba(15,46,83,0.4)",
                                        }}
                                    >
                                        {payeeMemoText}
                                        <he.Nbsp />
                                        <span className="micro text-primary fade-extreme">
                                            (payee custom defined memo)
                                        </span>
                                    </span>
                                </div>
                                <div className="nowrap fade-extreme">
                                    <he.SL /><he.Space />
                                    {sequence}
                                </div>
                            </div>
                        }
                        {asset &&
                            <div className="flex-box-col items-flex-end">
                                <div style={{ marginTop: 60 }}>
                                    <Button
                                        color="primary"
                                        onClick={this.sendAsset}
                                        disabled={
                                            this.props.amount === string.empty() ||
                                                !this.props.payee
                                        }
                                    >
                                        {this.state.inProgress ? <CircularProgress
                                            color="secondary" thickness={4} size={20}
                                        /> : "Sign & Send"}
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={this.props.hideModal}
                                        disabled={this.state.inProgress}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                                <Typography variant="caption" color="primary">
                                    {this.state.statusMessage ?
                                        this.state.statusMessage : <he.Nbsp />
                                    }
                                </Typography>
                            </div>
                        }
                    </div>
                </Fragment>
        )(this.props)
    }
)
