import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withAssetManager } from "../AssetManager"
import { pubKeyAbbr } from "../../lib/utils"
import { BigNumber } from "bignumber.js"
import MD5 from "../../lib/md5"
import { maximumTrustLimit } from "../StellarFox/env"
import Paper from "../../lib/mui-v1/Paper"
import Avatar from "../../lib/mui-v1/Avatar"




// <AssetList> component
class AssetList extends Component {

    // ...
    formatAssets = (assets) => assets.map((asset, index) => {
        return (
            <Fragment key={index}>
                <Paper color="primary">
                    <div className="f-b space-between cursor-pointer">
                        <Avatar src={`https://www.gravatar.com/avatar/${
                            MD5(asset.asset_issuer)}?s=42&d=robohash`}
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
                            <div className="nano p-t-nano fade-strong">
                                Trust Limit: {
                                    new BigNumber(asset.limit)
                                        .isLessThan(maximumTrustLimit) ?
                                        asset.limit : "None"
                                }
                            </div>
                        </div>
                    </div>
                </Paper>
            </Fragment>
        )
    })


    // ...
    render = () =>
        <div className="f-b-col">
            {this.formatAssets(this.props.assets)}
        </div>

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
