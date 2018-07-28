import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators, compose } from "redux"
import { BigNumber } from "bignumber.js"
import NumberFormat from "react-number-format"
import {
    htmlEntities as he,
    pubKeyAbbr,
    StellarSdk,
} from "../../lib/utils"
import { maximumTrustLimit } from "../StellarFox/env"
import { withStyles } from "@material-ui/core/styles"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
import { withAssetManager } from "../AssetManager"
import { withLoginManager } from "../LoginManager"
import Paper from "../../lib/mui-v1/Paper"
import Avatar from "../../lib/mui-v1/Avatar"
import VerifiedUser from "@material-ui/icons/VerifiedUser"
import { action as AssetManagerAction } from "../../redux/AssetManager"
import { action as ModalAction } from "../../redux/Modal"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import Switch from "../../lib/mui-v1/Switch"
import { toBool } from "@xcmats/js-toolbox"
import { clone, remove } from "lodash"
import { config } from "../../config"




// ...
const baseAssets = config.assets.codes.map(
    assetCode => new StellarSdk.Asset(
        assetCode,
        config.assets.issuer
    )
)


// ...
const styles = theme => ({
    progress: {
        color: theme.palette.secondary.main,
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit / 1.10,
        marginTop: theme.spacing.unit / 1.10,
        padding: theme.spacing.unit,
    },
})


// ...
const RequestProgress = withStyles(styles)(
    ({ classes, }) =>
        <CircularProgress className={classes.progress}
            thickness={4} size={40}
        />
)


// <AssetList> component
export default compose(
    withAssetManager,
    withLoginManager,
    connect(
        // map state to props
        (state) => ({
            awaitingSignature: state.Assets.awaitingSignature,
            awaitingTrust: state.Assets.awaitingTrust,
            loading: state.Assets.loading,
            assets: state.StellarAccount.assets,
            publicKey: state.StellarAccount.publicKey,
            horizon: state.StellarAccount.horizon,
        }),
        (dispatch) => bindActionCreators({
            setState: AssetManagerAction.setState,
            setStellarAccountState: StellarAccountAction.setState,
            hideModal: ModalAction.hideModal,
            showModal: ModalAction.showModal,
        }, dispatch)
    )
)(
    class extends Component {


        // ...
        componentDidMount = () => {
            this.props.setState({
                awaitingTrust: [],
            })

            let updatedAwaitingTrust = []

            baseAssets.forEach((baseAsset) => {
                let trustedAsset = this.props.assets.find(
                    asset => baseAsset.getCode() === asset.asset_code &&
                        baseAsset.getIssuer() === asset.asset_issuer
                )

                if (!trustedAsset) {
                    updatedAwaitingTrust.push(baseAsset)
                }
            })

            this.props.setState({
                awaitingTrust: updatedAwaitingTrust,
            })

        }


        // ...
        removeTrustline = async (baseAsset) => {

            let stellarAssets = clone(this.props.assets)

            let removed = remove(stellarAssets,
                asset => asset.asset_code === baseAsset.getCode() &&
                    asset.asset_issuer === baseAsset.getIssuer()
            )

            await this.props.setStellarAccountState({ assets: stellarAssets, })

            // ================================================================

            // 1.
            const alreadyQueued = this.props.awaitingSignature.find(
                asset => asset.code === baseAsset.getCode() &&
                    asset.issuer === baseAsset.getIssuer())

            if (alreadyQueued) {
                let awaitingSignature = clone(this.props.awaitingSignature)
                remove(awaitingSignature,
                    asset => asset.code === baseAsset.getCode() &&
                        asset.issuer === baseAsset.getIssuer()
                )
                await this.props.setState({ awaitingSignature, })
                return Promise.resolve({ ok: true, })
            }

            // 2.
            if (removed.limit !== "0.00") {
                let awaitingSignature = clone(this.props.awaitingSignature)
                baseAsset.trustLimit = "0"
                awaitingSignature.push(baseAsset)
                await this.props.setState({ awaitingSignature, })
            }
            return Promise.resolve({ ok: true, })

        }


        // ...
        addTrustline = async (baseAsset) => {

            const newStellarAsset = {
                asset_code: baseAsset.getCode(),
                asset_issuer: baseAsset.getIssuer(),
                asset_type: config.assets.type,
                avatar: config.assets.avatar,
                balance: "0.00",
                decimals: 2,
                limit: "0.00",
                verified: true,
            }

            let stellarAssets = clone(this.props.assets)
            stellarAssets.push(newStellarAsset)
            await this.props.setStellarAccountState({ assets: stellarAssets, })

            // ================================================================

            // 1.
            const alreadyQueued = this.props.awaitingSignature.find(
                asset => asset.code === baseAsset.getCode() &&
                    asset.issuer === baseAsset.getIssuer())

            if (alreadyQueued) {
                let awaitingSignature = clone(this.props.awaitingSignature)
                remove(awaitingSignature,
                    asset => asset.code === baseAsset.getCode() &&
                        asset.issuer === baseAsset.getIssuer()
                )
                await this.props.setState({ awaitingSignature, })
                return Promise.resolve({ok: true,})
            }


            // 2.
            const needsTrustline = this.props.awaitingTrust.find(
                asset => asset.code === baseAsset.getCode() &&
                    asset.issuer === baseAsset.getIssuer())

            if (needsTrustline) {
                let awaitingSignature = clone(this.props.awaitingSignature)
                awaitingSignature.push(baseAsset)
                await this.props.setState({ awaitingSignature, })
            }
            return Promise.resolve({ok: true,})

        }


        // ...
        balanceIsZero = (asset) => new BigNumber(asset.balance).isEqualTo(0)


        // ...
        displayAvatar = (asset) =>
            this.props.assets.find((a) =>
                a.asset_code === asset.asset_code
            ).avatar


        // ...
        displayVerified = (asset) =>
            this.props.assets.find((a) =>
                a.asset_code === asset.asset_code
            ).verified &&
                <div className="f-b-col-c center">
                    <div>
                        <VerifiedUser
                            className="svg-success m-l-small"
                        />
                        <Typography variant="caption" color="secondary">
                            Verified
                        </Typography>
                    </div>
                </div>


        // ...
        displayBalance = (asset) => {
            const decimals = this.props.assets.find((a) =>
                a.asset_code === asset.asset_code
            ).decimals

            return <NumberFormat
                value={new BigNumber(asset.balance).toFixed(
                    decimals
                )}
                displayType={"text"} thousandSeparator={true}
                decimalScale={decimals}
                fixedDecimalScale={true}
            />
        }


        // ...
        displayLimit = (asset) => {
            let assetInfoObj = this.props.assets.find((a) =>
                a.asset_code === asset.asset_code
            )

            let assetLimit = new BigNumber(asset.limit)

            return assetInfoObj && assetInfoObj.decimals ?
                assetLimit.isLessThan(maximumTrustLimit) ?
                    <NumberFormat
                        value={assetLimit.toFixed(assetInfoObj.decimals)}
                        displayType={"text"} thousandSeparator={true}
                        decimalScale={assetInfoObj.decimals}
                        fixedDecimalScale={true}
                    /> : "Unlimited" :
                asset.balance
        }


        // ...
        isTrustedAsset = (baseAsset) =>
            toBool(this.props.assets.find(
                asset => baseAsset.getCode() === asset.asset_code &&
                    baseAsset.getIssuer() === asset.asset_issuer))


        // ...
        formatAssets = (assets) => baseAssets.map((baseAsset, index) => {
            let trustedAsset = assets.find(
                asset => baseAsset.getCode() === asset.asset_code &&
                    baseAsset.getIssuer() === asset.asset_issuer
            )


            return trustedAsset ? <Grid item key={index} xs={12} sm={12} md={6}
                lg={6} xl={4}
            >
                <Paper color="primaryMaxWidth">{this.props.loading ?
                    <div className="f-b-c">
                        <RequestProgress />
                        <Typography variant="caption" color="secondary">
                            Updating ...
                        </Typography>
                    </div> :

                    <div
                        className="f-b-c space-between"
                    >

                        <div className="p-l-small">
                            <Avatar src={this.displayAvatar(trustedAsset)} />
                        </div>

                        <div className="p-l-small">
                            {this.displayVerified(trustedAsset)}
                        </div>

                        {this.balanceIsZero(trustedAsset) &&
                            this.props.loginManager.isPayEnabled() &&
                            <Switch
                                checked={this.isTrustedAsset(baseAsset)}
                                onChange={this.removeTrustline.bind(
                                    this, baseAsset
                                )}
                                color="secondary"
                            />
                        }

                        <div
                            onClick={
                                this.props.loginManager.isAuthenticated() &&
                                this.showAssetDetails.bind(
                                    this, trustedAsset
                                )
                            }
                            className={`p-l-small ${
                                this.props.loginManager.isAuthenticated() &&
                                "cursor-pointer"
                            }`}
                        >
                            <div className="p-b-nano">
                                <Typography variant="caption"
                                    color="secondary"
                                >
                                    Issuer:<he.Nbsp /><he.Nbsp />
                                    {pubKeyAbbr(trustedAsset.asset_issuer)}
                                </Typography>
                            </div>

                            <Typography variant="subheading" color="secondary">
                                <span className="asset-balance">
                                    {this.displayBalance(trustedAsset)}
                                </span>
                                <span className="asset-code">
                                    {trustedAsset.asset_code}
                                </span>
                            </Typography>

                            <Typography variant="caption" color="secondary">
                                Trust Limit:<he.Nbsp /><he.Nbsp />
                                {this.displayLimit(trustedAsset)}
                            </Typography>

                        </div>
                    </div>

                }
                </Paper>
            </Grid> : this.props.loginManager.isAuthenticated() &&
            <Grid item key={index} xs={12} sm={12} md={6} lg={6}
                xl={4}
            >
                <Paper color="primaryMaxWidth">{this.props.loading ?
                    <div className="f-b-c">
                        <RequestProgress />
                        <Typography variant="caption" color="secondary">
                            Updating ...
                        </Typography>
                    </div> :

                    <div
                        className="f-b-c space-between"
                    >

                        <div className="p-l-small washed-out-strong">
                            <Avatar src={config.assets.avatar} />
                        </div>

                        <div className="p-l-small washed-out-strong">
                            <div className="f-b-col-c center">
                                <div>
                                    <VerifiedUser
                                        className="svg-success m-l-small"
                                    />
                                    <Typography variant="caption"
                                        color="secondary"
                                    >
                                        Verified
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div className="washed-out">
                            <Switch
                                checked={this.isTrustedAsset(baseAsset)}
                                onChange={this.addTrustline.bind(
                                    this, baseAsset
                                )}
                                color="secondary"
                            />
                        </div>

                        <div className="p-l-small washed-out-strong">
                            <div className="p-b-nano">
                                <Typography variant="caption"
                                    color="secondary"
                                >
                                    Issuer:<he.Nbsp /><he.Nbsp />
                                    {pubKeyAbbr(config.assets.issuer)}
                                </Typography>
                            </div>

                            <Typography variant="subheading" color="secondary">
                                <span className="asset-balance">
                                    0.00
                                </span>
                                <span className="asset-code">
                                    {baseAsset.getCode()}
                                </span>
                            </Typography>

                            <Typography variant="caption" color="secondary">
                                Trust Limit:<he.Nbsp /><he.Nbsp />None
                            </Typography>
                        </div>

                    </div>

                }
                </Paper>
            </Grid>
        })


        // ...
        showAssetDetails = (asset, _event) => {
            this.props.setState({ selected: asset, })
            this.props.showModal("assetDetails")
        }


        // ...
        render = () =>
            <Grid
                container
                alignContent="flex-start"
                alignItems="center"
                spacing={0}
            >
                { this.formatAssets(this.props.assets) }
            </Grid>

    }
)
