import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import {
    func,
    shorten,
} from "@xcmats/js-toolbox"
import {
    Grid,
    Typography,
} from "@material-ui/core"
import Avatar from "../../lib/mui-v1/Avatar"
import Paper from "../../lib/mui-v1/Paper"
import Trianglify from "trianglify"
import NumberFormat from "react-number-format"
import { getAssetInfo } from "../../thunks/assets"




/**
 * Cygnus.
 *
 * Asset component.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




// ...
const makePattern = (seed) => {
    const pattern = Trianglify({
        height: 300,
        width: 300,
        cell_size: 30,
        variance: 1,
        stroke_width: 0,
        seed,
    })
    return pattern.png()
}




/**
 * `<Asset>` component.
 *
 * @function Asset
 * @returns {React.ReactElement}
 */
const Asset = ({ assetCollection, data, getAssetInfo }) => {

    React.useEffect(() => {
        getAssetInfo(data.asset_issuer)
    }, [])

    const assetInfo = assetCollection[Object.keys(assetCollection).find((el) => {
        return assetCollection[el].issuer === data.asset_issuer &&
            assetCollection[el].code === data.asset_code
    })]

    let assetData = {
        assetCode: data.asset_code,
        assetImage: "/img/logo.png",
        assetDecimals: "7",
    }

    if (assetInfo) {
        assetInfo.code && (assetData.assetCode = assetInfo.code)
        assetInfo.image && (assetData.assetImage = assetInfo.image)
        assetInfo.display_decimals && (assetData.assetDecimals = assetInfo.display_decimals)
    }


    return <Grid item zeroMinWidth>
        <Paper color="secondary" style={{
            background: `url(${makePattern(data.asset_issuer)})`,
            backgroundSize: "cover",
        }}
        >
            <div className="flex-box-row space-between items-centered">
                <Avatar style={{ opacity: 0.5 }} src={assetData.assetImage} />
                <div className="m-l flex-box-col space-between">
                    <Typography variant="h4">
                        <span className="balance-text">
                            <NumberFormat
                                value={data.balance}
                                displayType={"text"}
                                thousandSeparator={true}
                                decimalScale={parseInt(assetData.assetDecimals, 10)}
                                fixedDecimalScale={true}
                            />
                        </span>
                        <span className="asset-code"
                            style={{marginLeft: "0.5em"}}
                        >
                            {assetData.assetCode}
                        </span>
                    </Typography>
                    <Typography color="textPrimary">
                        <span className="micro fade-strong">
                            {shorten(
                                data.asset_issuer,
                                13,
                                shorten.MIDDLE,
                                "-"
                            )}
                        </span>
                    </Typography>
                </div>
            </div>
        </Paper>
    </Grid>
}



// ...
export default func.compose(
    withStyles((theme) => ({
        colorTextPrimary: {
            color: theme.palette.primary.light,
        },
        colorTextSecondary: {
            color: theme.palette.secondary.light,
        },
    })),
    connect(
        (state, ownProps) => ({
            assetCollection: state.Asset[ownProps.data.asset_issuer] || {},
        }),
        (dispatch) => bindActionCreators({
            getAssetInfo,
        }, dispatch),
    ),
)(Asset)
