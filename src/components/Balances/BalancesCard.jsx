import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import { Asset } from "stellar-sdk"
import {
    delay,
    string,
    timeUnit,
} from "@xcmats/js-toolbox"
import {
    buildChangeTrustTx,
    loadAccount,
    submitTransaction,
} from "../../lib/stellar-tx"
import {
    signTransaction,
    getSoftwareVersion,
} from "../../lib/ledger"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import { notImplementedText } from "../StellarFox/env"
import {
    Card,
    CardActions,
    CardHeader,
    CardText,
} from "material-ui/Card"
import NumberFormat from "react-number-format"
import Button from "../../lib/mui-v1/Button"
import AssetList from "./AssetList"
import { action as AlertAction } from "../../redux/Alert"
import { action as BalancesAction } from "../../redux/Balances"
import {
    accountIsLocked,
    augmentAssets,
    htmlEntities as he,
    insertPathIndex,
    currentAccountReserve,
} from "../../lib/utils"
import Icon from "@material-ui/core/Icon"
import { CircularProgress, Paper, Typography } from "@material-ui/core"

import { action as AssetManagerAction } from "../../redux/AssetManager"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as StellarAccountAction } from "../../redux/StellarAccount"

import { config } from "../../config"




// ...
const baseAssets = config.assets.codes.map(
    assetCode => new Asset(
        assetCode,
        config.assets.issuer
    )
)




// <BalancesCard> component
class BalancesCard extends Component {

    // ...
    state = {
        inProgress: false,
        statusMessage: string.empty(),
    }


    // ...
    componentDidMount = () => {
        this.props.setAssetsState({
            awaitingSignature: [],
        })
        loadAccount(
            this.props.publicKey, this.props.horizon
        ).then((account) => this.updateAccountTree(account))
        this.props.assetManager.updateExchangeRate(this.props.Account.currency)
    }


    // ...
    changeTrustNeedsSignature = () =>
        this.props.Assets.awaitingSignature.length > 0


    // ...
    toggleFundCard = () =>
        this.props.setState({
            fundCardVisible: !this.props.Balances.fundCardVisible,
        })


    // ...
    togglePaymentCard = () =>
        this.props.setState({
            payCardVisible: !this.props.Balances.payCardVisible,
        })


    // ...
    signChangeTrust = async () => {
        this.setState({
            inProgress: true,
            statusMessage: "Building transaction ...",
        })

        const txData = {
            source: this.props.publicKey,
            network: this.props.horizon,
            assets: this.props.Assets.awaitingSignature,
        }

        let tx = await buildChangeTrustTx(txData)

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

            this.props.setState({
                txId: broadcast.hash,
                ledgerId: broadcast.ledger,
            })

            await this.setState({
                inProgress: false,
                statusMessage: string.empty(),
            })

            await this.props.setAssetsState({
                awaitingSignature: [],
            })

            this.props.popupSnackbar("Trustlines updated.")

            const account = await loadAccount(
                this.props.publicKey, this.props.horizon
            )

            await this.updateAccountTree(account)
            await this.updateAwaitingTrust()

        } catch (error) {
            this.setState({
                inProgress: false,
                statusMessage: error.message,
            })
            return Promise.resolve({
                error: true, message: error.message,
            })
        }


    }


    // ...
    showNotImplementedModal = () =>
        this.props.showAlert(notImplementedText, "Not Yet Implemented")


    // ...
    exchangeRateFetched = () => this.props.Assets[this.props.Account.currency]


    // ...
    updateAccountTree = async (account) => {
        this.props.setAssetsState({ loading: true })
        this.props.updateAccountTree(account)
        delay(0.3 * timeUnit.second).then(() => {
            augmentAssets(
                this.props.StellarAccount.assets,
                this.props.StellarAccount.horizon
            ).then((augmentedAssets) => {
                this.props.setStellarAccountState({
                    assets: augmentedAssets,
                })
                this.props.setAssetsState({ loading: false })
            })

        })
    }


    // ...
    updateAwaitingTrust = async () => {
        await this.props.setAssetsState({
            awaitingTrust: [],
        })

        let updatedAwaitingTrust = []

        baseAssets.forEach((baseAsset) => {
            let trustedAsset = this.props.StellarAccount.assets.find(
                asset => baseAsset.getCode() === asset.asset_code &&
                    baseAsset.getIssuer() === asset.asset_issuer
            )

            if (!trustedAsset) {
                updatedAwaitingTrust.push(baseAsset)
            }
        })

        await this.props.setAssetsState({
            awaitingTrust: updatedAwaitingTrust,
        })
    }


    // ...
    render = () =>
        <Card className={`account ${accountIsLocked(
            this.props.StellarAccount.signers,
            this.props.StellarAccount.accountId
        ) && "locked"}`}
        >
            <CardHeader
                title={
                    <Typography variant="subtitle1" color="primary">
                        Current Balance
                    </Typography>
                }
                subtitle={
                    <Typography variant="subtitle2" color="primary">
                        {this.props
                            .assetManager.getAssetDescription(
                                this.props.Account.currency
                            )}
                        <span className="fade-strong currency-iso p-l-medium">
                            {this.props.Account.currency.toUpperCase()}
                        </span>
                    </Typography>
                }
                actAsExpander={true}
                showExpandableButton={this.props.loginManager.isAuthenticated()}
            />

            <CardText>
                <div className="flex-box-row space-between">

                    <div>
                        <div className="text-primary">
                            <span className="fade currency-glyph">
                                {
                                    this.props
                                        .assetManager.getAssetGlyph(
                                            this.props.Account.currency
                                        )
                                }
                            </span>
                            <span className="p-l-medium balance">
                                <NumberFormat
                                    value={this.props
                                        .assetManager.convertToAsset(
                                            this.props.StellarAccount.balance
                                        )}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </span>

                            {accountIsLocked(
                                this.props.StellarAccount.signers,
                                this.props.StellarAccount.accountId
                            ) &&
                                <div className="red"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Icon
                                        style={{
                                            marginLeft: "1rem",
                                            marginBottom: "6px",
                                            fontSize: "20px",
                                        }}
                                    >
                                    lock
                                    </Icon>
                                    <span style={{
                                        fontSize: "14px",
                                        marginBottom: "3px",
                                        marginLeft: "2px",
                                    }}
                                    >
                                        Account Locked
                                    </span>
                                </div>
                            }

                        </div>
                        <Typography color="primary" variant="h3"
                            className="fade-extreme"
                        >
                            <NumberFormat
                                value={this.props.StellarAccount.balance}
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={7}
                                fixedDecimalScale={true}
                            /> XLM
                        </Typography>
                        <Typography color="primary" variant="h3"
                            className="fade-extreme"
                        >
                            1 XLM ≈ <NumberFormat
                                value={this.props.assetManager
                                    .convertToAsset("1.0000000")
                                }
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale={true}
                            /> {this.props.assetManager.getAssetGlyph(
                                this.props.Account.currency)}
                        </Typography>
                    </div>

                    {/* Minimum Balance Section */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            alignItems: "flex-end",
                        }}
                    >
                        <Typography variant="caption" color="primary">
                            <span className="fade-strong">Min Balance</span>
                        </Typography>
                        <Typography variant="body1" color="primary">
                            <span style={{ paddingRight: "3px" }} className="fade">{
                                this.props.assetManager.getAssetGlyph(
                                    this.props.Account.currency
                                )
                            }</span>
                            <span className="fade">
                                <NumberFormat
                                    value={
                                        this.props.assetManager.convertToAsset(
                                            currentAccountReserve(
                                                this.props.StellarAccount.subentryCount
                                            )
                                        )
                                    }
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                />
                            </span>
                        </Typography>
                        <Typography variant="h3" color="primary">
                            <span className="fade-extreme">
                                <NumberFormat
                                    value={currentAccountReserve(
                                        this.props.StellarAccount.subentryCount
                                    )}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    decimalScale={7}
                                    fixedDecimalScale={true}
                                /> XLM
                            </span>
                        </Typography>
                    </div>
                </div>
            </CardText>

            <CardActions>
                {accountIsLocked(
                    this.props.StellarAccount.signers,
                    this.props.StellarAccount.accountId
                ) ? <Paper className="paper gradiented-warning" elevation={3}>
                        <Typography variant="body1">
                            <span className="red">
                                Warning!
                            </span>
                        </Typography>
                        <Typography variant="caption" color="inherit">
                            This account has been locked and this state cannot<he.Nbsp />
                            be undone.<he.Nbsp />
                            All remaining funds are frozen and final.
                        </Typography>
                        <Typography variant="caption" color="inherit">
                            <span className="red">DO NOT</span> deposit<he.Nbsp />
                            anything onto this account as you will never be<he.Nbsp />
                            able to recover or withdraw those funds.
                        </Typography>
                    </Paper> :
                    <Fragment>
                        <Button
                            color="success"
                            onClick={this.toggleFundCard}
                        >Fund</Button>
                        <Button
                            color="warning"
                            onClick={this.showNotImplementedModal}
                        >Request</Button>
                        {this.props.loginManager.isPayEnabled() &&
                            <Button
                                color="danger"
                                onClick={this.togglePaymentCard}
                            >Pay</Button>
                        }
                    </Fragment>
                }
            </CardActions>

            {this.props.loginManager.isAuthenticated() &&
            <CardText expandable={true}>
                <Typography variant="h6" color="primary">
                    Available Currencies
                </Typography>
                <Typography variant="subtitle1" color="primary">
                    Use slider to enable/disable currency. Click to send payment.
                </Typography>
                <br />
                <AssetList />
                <br />
                <Button
                    color="primary"
                    onClick={this.signChangeTrust}
                    disabled={
                        !this.changeTrustNeedsSignature() ||
                        this.state.inProgress
                    }
                >
                    {this.state.inProgress ? <CircularProgress
                        color="primary" thickness={4}
                        size={20}
                    /> : "Sign & Save"}
                </Button>

                <div className="flex-box-col items-flex-start">
                    <Typography variant="caption" color="primary">
                        {this.state.statusMessage ?
                            this.state.statusMessage : <he.Nbsp />
                        }
                    </Typography>
                </div>
            </CardText>
            }
        </Card>

}


// ...
export default compose(
    withLoginManager,
    withAssetManager,
    connect(
        // map state to props.
        (state) => ({
            Balances: state.Balances,
            Account: state.Account,
            Assets: state.Assets,
            StellarAccount: state.StellarAccount,
            horizon: state.StellarAccount.horizon,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: BalancesAction.setState,
            setAssetsState: AssetManagerAction.setState,
            setStellarAccountState: StellarAccountAction.setState,
            showAlert: AlertAction.showAlert,
            popupSnackbar: SnackbarAction.popupSnackbar,
            updateAccountTree: StellarAccountAction.loadStellarAccount,
        }, dispatch)
    )
)(BalancesCard)
