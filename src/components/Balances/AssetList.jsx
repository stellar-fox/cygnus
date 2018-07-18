import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { BigNumber } from "bignumber.js"
import NumberFormat from "react-number-format"
import { htmlEntities as he, pubKeyAbbr } from "../../lib/utils"
import { maximumTrustLimit } from "../StellarFox/env"
import { withStyles } from "@material-ui/core/styles"
import { CircularProgress, Grid, Typography } from "@material-ui/core"
import { withAssetManager } from "../AssetManager"
import Paper from "../../lib/mui-v1/Paper"
import Avatar from "../../lib/mui-v1/Avatar"
import VerifiedUser from "@material-ui/icons/VerifiedUser"




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
    connect(
        // map state to props
        (state) => ({
            loading: state.Assets.loading,
            assets: state.StellarAccount.assets,
            publicKey: state.StellarAccount.publicKey,
            horizon: state.StellarAccount.horizon,
        })
    )
)(
    class extends Component {

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
                (<div className="f-b-col-c center">
                    <div>
                        <VerifiedUser
                            className="svg-success m-l-small"
                        />
                        <Typography variant="caption" color="secondary">
                            Verified
                        </Typography>
                    </div>
                </div>)
        


        // ...
        displayBalance = (asset) => {
            const decimals = this.props.assets.find((a) =>
                a.asset_code === asset.asset_code
            ).decimals

            return (<NumberFormat
                value={new BigNumber(asset.balance).toFixed(
                    decimals
                )}
                displayType={"text"} thousandSeparator={true}
                decimalScale={decimals}
                fixedDecimalScale={true}
            />)

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
                    /> : "None" :
                asset.balance
        }


        // ...
        formatAssets = (assets) => assets.map((asset, index) =>
            <Grid item key={index} xs={12} sm={12} md={6} lg={6} xl={4}>
                <Paper color="primaryMaxWidth">{this.props.loading ?
                    <div className="f-b-c">
                        <RequestProgress />
                        <Typography variant="caption" color="secondary">
                            Updating ...
                        </Typography>
                    </div> :
                    
                    <div className="f-b-c space-between cursor-pointer">

                        <div className="p-l-small">
                            <Avatar src={this.displayAvatar(asset)} />
                        </div>

                        <div className="p-l-small">
                            {this.displayVerified(asset)}
                        </div>

                        <div className="p-l-small">
                            <div className="p-b-nano">
                                <Typography variant="caption"
                                    color="secondary"
                                >
                                    Issuer:<he.Nbsp /><he.Nbsp />
                                    {pubKeyAbbr(asset.asset_issuer)}
                                </Typography>
                            </div>

                            <Typography variant="subheading" color="secondary">
                                <span className="asset-balance">
                                    {this.displayBalance(asset)}
                                </span>
                                <span className="asset-code">
                                    {asset.asset_code}
                                </span>
                            </Typography>

                            <Typography variant="caption" color="secondary">
                                Trust Limit:<he.Nbsp /><he.Nbsp />
                                {this.displayLimit(asset)}
                            </Typography>

                        </div>
                    </div>
                    
                }
                </Paper>
            </Grid>
        )


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
