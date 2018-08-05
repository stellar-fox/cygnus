import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import {
    bindActionCreators,
    compose,
} from "redux"
import { withLoginManager } from "../LoginManager"
import { withAssetManager } from "../AssetManager"
import { notImplementedText } from "../StellarFox/env"
import { accountIsLocked, htmlEntities as he } from "../../lib/utils"
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
    augmentAssets, insertPathIndex, currentAccountReserve, StellarSdk,
} from "../../lib/utils"
import Icon from "@material-ui/core/Icon"
import { CircularProgress, Typography } from "@material-ui/core"
import {
    buildChangeTrustTx, loadAccount, submitTransaction
} from "../../lib/stellar-tx"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import { action as AssetManagerAction } from "../../redux/AssetManager"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { delay } from "@xcmats/js-toolbox"
import { config } from "../../config"



// ...
const baseAssets = config.assets.codes.map(
    assetCode => new StellarSdk.Asset(
        assetCode,
        config.assets.issuer
    )
)




// <BalancesCard> component
class BalancesCard extends Component {

    // ...
    state = {
        inProgress: false,
        statusMessage: "",
    }


    // ...
    componentDidMount = () => {
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
                statusMessage: "",
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
        this.props.setAssetsState({ loading: true, })
        this.props.updateAccountTree(account)
        delay(300).then(() => {
            augmentAssets(
                this.props.StellarAccount.assets,
                this.props.StellarAccount.horizon
            ).then((augmentedAssets) => {
                this.props.setStellarAccountState({
                    assets: augmentedAssets,
                })
                this.props.setAssetsState({ loading: false, })
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
        <Card className="account">
            <CardHeader
                title={
                    <span>
                        <span>Current Balance </span>
                        <i className="material-icons">hearing</i>
                    </span>
                }
                subtitle={
                    <span>
                        <span>
                            {this.props
                                .assetManager.getAssetDescription(
                                    this.props.Account.currency
                                )}
                        </span>
                        <span className="fade currency-iso p-l-small">
                            ({this.props.Account.currency.toUpperCase()})
                        </span>
                    </span>
                }
                actAsExpander={true}
                showExpandableButton={true}
            />

            <CardText>
                <div className="f-b space-between">
                    <div>
                        <div className="balance">
                            <span className="fade currency-glyph">
                                {
                                    this.props
                                        .assetManager.getAssetGlyph(
                                            this.props.Account.currency
                                        )
                                }
                            </span>
                            <span className="p-l-small">
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
                            ) ?
                                <div className="error"
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
                                </div> : null
                            }

                        </div>
                        <div className="fade-extreme micro">
                            <NumberFormat
                                value={this.props.StellarAccount.balance}
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={7}
                                fixedDecimalScale={true}
                            /> XLM
                        </div>
                        <div className="fade-extreme micro">
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
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            alignItems: "flex-end",
                        }}
                    >
                        <Typography variant="caption" color="inherit">
                            <span className="fade-strong">Min Balance</span>
                        </Typography>
                        <Typography variant="body1" color="inherit">
                            <span className="fade">{
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
                        <Typography variant="body1" color="inherit">
                            <span className="fade-extreme micro">
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
                <Button
                    color="success"
                    onClick={this.toggleFundCard}
                >Fund</Button>
                <Button
                    color="warning"
                    onClick={this.showNotImplementedModal}
                >Request</Button>
                {
                    this.props.loginManager.isPayEnabled() ?
                        <Button
                            color="danger"
                            onClick={this.togglePaymentCard}
                        >Pay</Button> : null
                }
            </CardActions>

            <CardText expandable={true}>
                {this.props.loginManager.isPayEnabled() ?
                    <Fragment>
                        <Typography variant="subheading" color="primary">
                            Available Currencies
                        </Typography>
                        <Typography variant="caption" color="primary">
                            Use slider to enable/disable currency. Click to send payment.
                        </Typography>
                    </Fragment> :
                    <Fragment>
                        <Typography variant="subheading" color="primary">
                            Account Currency Assets
                        </Typography>
                        <Typography variant="caption" color="primary">
                            This is explore only mode. Login or Signup to make transactions.
                        </Typography>
                    </Fragment>
                }
                <br />
                <AssetList />

                {this.props.loginManager.isPayEnabled() &&
                <Fragment>
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
                </Fragment>
                }

                {this.props.loginManager.isAuthenticated() &&
                    <div className="p-t flex-box-col items-flex-start">

                        <Typography variant="caption" color="primary">
                            {this.state.statusMessage ?
                                this.state.statusMessage : <he.Nbsp />
                            }
                        </Typography>
                    </div>
                }
            </CardText>
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
