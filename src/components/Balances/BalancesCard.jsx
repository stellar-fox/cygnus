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
import Button from "../../lib/mui-v1/Button"
import AssetList from "./AssetList"
import { action as AlertAction } from "../../redux/Alert"
import { action as BalancesAction } from "../../redux/Balances"
import { augmentAssets, insertPathIndex, currentAccountReserve } from "../../lib/utils"
import Icon from "@material-ui/core/Icon"
import { CircularProgress, Typography } from "@material-ui/core"
import { buildChangeTrustTx, loadAccount, submitTransaction } from "../../lib/stellar-tx"
import { signTransaction, getSoftwareVersion } from "../../lib/ledger"
import { action as AssetManagerAction } from "../../redux/AssetManager"
import { action as SnackbarAction } from "../../redux/Snackbar"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { delay } from "@xcmats/js-toolbox"



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

            this.props.popupSnackbar("Trustlines Established.")

            const account = await loadAccount(
                this.props.publicKey, this.props.horizon
            )

            this.updateAccountTree(account)


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
    updateAccountTree = (account) => {
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
                                {
                                    this.props
                                        .assetManager.convertToAsset(
                                            this.props.StellarAccount.balance
                                        )
                                }
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
                            {this.props.StellarAccount.balance} XLM
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
                            <span className="fade">{
                                this.props.assetManager.convertToAsset(
                                    currentAccountReserve(
                                        this.props.StellarAccount.subentryCount
                                    )
                                )}</span>
                        </Typography>
                        <Typography variant="body1" color="inherit">
                            <span className="fade-extreme micro">
                                {currentAccountReserve(
                                    this.props.StellarAccount.subentryCount
                                )} XLM
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
                <Fragment>
                    <div className="assets p-b-small">
                        Available Currencies:
                    </div>
                    <AssetList />
                    <div className="p-t flex-box-col items-flex-start">
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
                            /> : "Save Changes"}
                        </Button>
                        <Typography variant="caption" color="primary">
                            {this.state.statusMessage ?
                                this.state.statusMessage : <he.Nbsp />
                            }
                        </Typography>
                    </div>
                </Fragment>
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
