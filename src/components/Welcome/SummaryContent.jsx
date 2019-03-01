import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { Typography } from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"



/**
 * Cygnus.
 *
 * Renders welcome page summary content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<SummaryContent>` component.
 *
 * @function SummaryContent
 * @returns {React.ReactElement}
 */
const SummaryContent = ({ classes }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <div className={
        isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgLight}` :
            `flex-box-row m-t-large space-around container ${classes.bgLight}`}
    >
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
            <Typography variant="h3" color="primary">
                
            </Typography>
        </div>
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
            <Typography variant="h3" color="primary">
                
            </Typography>
        </div>
    </div>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        bgLight: {
            backgroundColor: theme.palette.secondary.light,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(SummaryContent)
