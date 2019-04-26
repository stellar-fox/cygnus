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
const Asset = ({ data }) =>
    <Grid item key={`${data.asset_issuer}-${data.asset_code}`} zeroMinWidth>
        <Paper color="secondary" style={{
            background: `url(${makePattern(data.asset_issuer)})`,
        }}
        >
            <div className="flex-box-row space-between items-centered">
                <Avatar src="/img/logo.png" />
                <div className="m-l flex-box-col space-between">
                    <Typography variant="h4">
                        <span className="balance-text">
                            {data.balance} {data.asset_code}
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
        (_state) => ({

        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(Asset)
