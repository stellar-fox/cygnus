import React, { Component, Fragment } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { withAssetManager } from "../AssetManager"
import { pubKeyAbbr } from "../../lib/utils"
import { BigNumber } from "bignumber.js"
import { maximumTrustLimit } from "../StellarFox/env"




// <AssetList> component
class AssetList extends Component {

    // ...
    formatAssets = (assets) => assets.map((asset, index) => {
        return (
            <Fragment key={index}>
                <div className="p-t"></div>
                <div className="badge-blue p-b-small">
                    <div className="nano p-b-nano fade-strong">
                        {pubKeyAbbr(asset.asset_issuer)}
                    </div>
                    <div className="small">
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
        })
    )
)(AssetList)
