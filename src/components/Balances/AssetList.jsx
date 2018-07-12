import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { BigNumber } from "bignumber.js"

import { assetLookup, pubKeyAbbr } from "../../lib/utils"
import { maximumTrustLimit } from "../StellarFox/env"
import MD5 from "../../lib/md5"

import { Grid } from "@material-ui/core"

import { withAssetManager } from "../AssetManager"

import Paper from "../../lib/mui-v1/Paper"
import Avatar from "../../lib/mui-v1/Avatar"
import { loadAccount } from "../../lib/stellar-tx"




// <AssetList> component
export default compose(
    withAssetManager,
    connect(
        // map state to props
        (state) => ({
            assets: state.StellarAccount.assets,
            publicKey: state.StellarAccount.publicKey,
            horizon: state.StellarAccount.horizon,
        })
    )
)(
    class extends Component {

        // ..
        state = {
            assetTomlInfo: [],
        }


        // ...
        componentDidMount = () =>
            this.props.assets.forEach((asset) => this.assetAvatar(asset))


        // ...
        assetAvatar = async (asset) => {
            let issuingAccount = await loadAccount(
                asset.asset_issuer, this.props.horizon
            )

            if (issuingAccount.home_domain) {
                const assetInfo = await assetLookup(issuingAccount.home_domain)
                if (assetInfo) {
                    const assetIssuerInfo = assetInfo.find(
                        (a) => a.code === asset.asset_code
                    )
                    this.setState({
                        assetTomlInfo: [{
                            asset_code: asset.asset_code,
                            avatar: assetIssuerInfo ?
                                assetIssuerInfo.image :
                                `https://www.gravatar.com/avatar/${MD5(
                                    asset.asset_issuer
                                )}?s=42&d=mm`,
                            decimals: assetIssuerInfo ?
                                assetIssuerInfo.display_decimals : 7,
                        },],
                    })
                }
            }
        }


        // ...
        displayAvatar = (asset) => {
            let assetInfoObj = this.state.assetTomlInfo.find(
                (a) => a.asset_code === asset.asset_code
            )
            return assetInfoObj ? assetInfoObj.avatar :
                `https://www.gravatar.com/avatar/${MD5(
                    asset.asset_issuer
                )}?s=42&d=identicon`
        }


        // ...
        displayBalance = (asset) => {
            let assetInfoObj = this.state.assetTomlInfo.find(
                (a) => a.asset_code === asset.asset_code
            )

            return assetInfoObj && assetInfoObj.decimals ?
                new BigNumber(asset.balance).toFixed(assetInfoObj.decimals) :
                asset.balance
        }


        // ...
        formatAssets = (assets) => assets.map((asset, index) =>
            <Grid item key={index} xs={12} sm={12} md={4} lg={3} xl={2}>
                <Paper color="primaryMaxWidth">
                    <div className="f-b space-between cursor-pointer">
                        <Avatar src={this.displayAvatar(asset)} />
                        <div className="p-l-small">
                            <div className="nano p-b-nano fade-strong">
                                Issuer: {pubKeyAbbr(asset.asset_issuer)}
                            </div>
                            <div className="">
                                <span className="asset-balance">
                                    {this.displayBalance(asset)}
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
