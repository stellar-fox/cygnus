import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withAssetManager } from "../AssetManager"
import { pubKeyAbbr } from "../../lib/utils"
import { BigNumber } from "bignumber.js"
import MD5 from "../../lib/md5"
import { maximumTrustLimit } from "../StellarFox/env"
import Paper from "../../lib/mui-v1/Paper"
import Avatar from "../../lib/mui-v1/Avatar"
import Grid from "material-ui-next/Grid"




// <AssetList> component
class AssetList extends Component {

    // ...
    formatAssets = (assets) => assets.map((asset, index) =>
        <Grid item key={index} md>
            <Paper color="primary">
                <div className="f-b space-between cursor-pointer">
                    <Avatar src={`https://www.gravatar.com/avatar/${
                        MD5(asset.asset_issuer)}?d=robohash`}
                    />
                    <div className="p-l-small">
                        <div className="nano p-b-nano fade-strong">
                            Issuer: {pubKeyAbbr(asset.asset_issuer)}
                        </div>
                        <div className="">
                            <span className="asset-balance">
                                {asset.balance}
                            </span>
                            <span className="asset-code">
                                {asset.asset_code}
                            </span>
                        </div>
                        <div className="nano p-t-nano fade-strong nowrap">
                            Trust Limit: {
                                new BigNumber(asset.limit)
                                    .isLessThan(maximumTrustLimit) ?
                                    asset.limit : "None"
                            }
                        </div>
                    </div>
                </div>
            </Paper>
        </Grid>
    )


    // ...
    render = () =>
        <Grid container alignContent="flex-start" alignItems="center" spacing={0}>
            {this.formatAssets(this.props.assets)}
        </Grid>

}


// ...
export default compose (
    withAssetManager,
    connect(
        // map state to props
        (state) => ({
            assets: state.StellarAccount.assets,
            publicKey: state.StellarAccount.publicKey,
        })
    )
)(AssetList)
