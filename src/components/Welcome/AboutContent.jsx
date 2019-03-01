import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { Typography } from "@material-ui/core"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"



/**
 * Cygnus.
 *
 * Renders welcome page about content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<AboutContent>` component.
 *
 * @function AboutContent
 * @returns {React.ReactElement}
 */
const AboutContent = ({ classes }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <div className={
        isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgLight} ${classes.considerFooter}` :
            `flex-box-row space-around container ${classes.bgLight}`}
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
        considerFooter: {
            paddingBottom: 26,
        },
        bgLight: {
            backgroundColor: theme.palette.primary.light,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(AboutContent)
