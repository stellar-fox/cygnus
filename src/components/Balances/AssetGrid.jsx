import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    Grow,
    Grid,
} from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import Asset from "./Asset"




/**
 * Cygnus.
 *
 * Balance summary card.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<AssetGrid>` component.
 *
 * @function AssetGrid
 * @returns {React.ReactElement}
 */
const AssetGrid = ({ assets }) => <Grow in={true}><Grid
    container
    alignContent="flex-start"
    alignItems="center"
    spacing={16}
>
    {assets.map((asset) =>
        <Asset key={`${asset.asset_issuer}-${asset.asset_code}`} data={asset} />
    )}
</Grid></Grow>




// ...
export default func.compose(
    withStyles((theme) => ({
        colorTextSecondary: {
            color: theme.palette.secondary.light,
        },
    })),
    connect(
        (state) => ({
            assets: state.StellarAccount.assets || [],
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(AssetGrid)
