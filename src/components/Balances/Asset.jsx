import React from "react"
import { withStyles } from "@material-ui/core/styles"
import {
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
const Asset = ({ data }) => {


    let assetData = {
        assetCode: data.asset_code,
        assetImage: "/img/logo.png",
        assetDecimals: "7",
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
                    <Typography className="asset-code" variant="body1">
                        {assetData.assetCode}
                    </Typography>
                    <Typography className="balance-text" variant="h4">
                        <NumberFormat
                            value={data.balance}
                            displayType={"text"}
                            thousandSeparator={true}
                            decimalScale={parseInt(assetData.assetDecimals, 10)}
                            fixedDecimalScale={true}
                        />
                    </Typography>
                    <span className="micro fade-strong">
                        {shorten(
                            data.asset_issuer,
                            13,
                            shorten.MIDDLE,
                            "-"
                        )}
                    </span>
                </div>
            </div>
        </Paper>
    </Grid>
}



// ...
export default withStyles((theme) => ({
    colorTextPrimary: {
        color: theme.palette.primary.light,
    },
    colorTextSecondary: {
        color: theme.palette.secondary.light,
    },
}))(Asset)
