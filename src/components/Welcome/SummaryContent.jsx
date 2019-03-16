import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"
import sflogo from "../StellarFox/static/sf-logo.svg"



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
            `flex-box-row space-around ${classes.bgLight}`}
    >
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
            <div className="compact p-t-large p-b-large">
                <span className="blue summary-heading">
                    So you're new to crypto? No problem.</span> <span className="blue summary">
                    We make it easy to send and receive payments from your friends and relatives.
                </span>
                <div className="blue m-t summary">
                    From the first line of code we designed and built this wallet
                    for newcommers and experts alike. We're excited about helping
                    people discover the world of digital payments and expand their
                    portfolios to include other digital assets.
                </div>
            </div>
        </div>
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
            <div className="compact p-t-large p-b-large">
                <img
                    style={{ opacity: "0.2" }}
                    src={sflogo}
                    width="250px"
                    alt="Stellar Fox"
                />
            </div>
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
