import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { withStyles } from "@material-ui/core/styles"
import dylan from "../StellarFox/static/dylan.png"
import miranda from "../StellarFox/static/miranda.png"
import { stroop } from "../StellarFox/env"
import { BigNumber } from "bignumber.js"
import { BASE_FEE } from "stellar-sdk"



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
const SummaryContent = ({ baseFeeUSD, classes }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <Fragment>
        <div className={isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgLight}` :
            `flex-box-row content-centered ${classes.bgLight}`}
        >
            <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div style={{ paddingTop: "4rem" }} className="compact p-b-large">
                    <span style={{ color: "#937121" }} className="summary-heading">
                        So you're new to crypto? No problem.</span> <span style={{ color: "#937121" }} className="summary">
                        We make it easy to send and receive payments from your friends and relatives.
                    </span>
                    <div className="m-t summary" style={{ color: "#937121" }}>
                        From the first line of code we designed and built this wallet
                        for newcommers and experts alike. We're excited about helping
                        people discover the world of digital payments and expand their
                        portfolios to include other digital assets.
                    </div>
                </div>
            </div>
            <div style={{ marginLeft: "4rem" }} className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div className="compact p-t-x-large p-b-x-large">
                    <img
                        style={{ opacity: "0.2", borderRadius: "30%" }}
                        src={dylan}
                        width="250px"
                        alt="New to this?"
                    />
                </div>
            </div>
        </div>
        <div className={isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgDark}` :
            `flex-box-row content-centered items-centered ${classes.bgDark}`}
        >
            <div style={{ marginRight: "8rem" }} className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div className="compact p-t-x-large p-b-x-large">
                    <img
                        style={{ opacity: "0.22", borderRadius: "50%" }}
                        src={miranda}
                        width="350px"
                        alt="Buy Another Day"
                    />
                </div>
            </div>
            <div className="compact p-t-x-large p-b-x-large">
                <span style={{ color: "#8493a5" }} className="yellow-light fade summary-heading">
                    Buy Another Day.</span> <span style={{ color: "#8493a5" }} className="yellow-light fade summary">
                    We're giving away first 1,000,000 accounts for free
                    to help users experience this new domain.
                </span>
                <div style={{ color: "#8493a5" }} className="yellow-light fade m-t summary">
                    Watch out, you will never be charged here elevated fees
                    for your transactions - and there’s never any guesswork or
                    hidden costs. You only pay the base network fee per operation.
                    Currently that cost stands at around {baseFeeUSD} USD.
                </div>
            </div>
        </div>
    </Fragment>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        bgLight: {
            backgroundColor: theme.palette.secondary.light,
        },
        bgDark: {
            backgroundColor: theme.palette.primary.main,
        },
    })),
    connect(
        (state) => ({
            baseFeeUSD: (new BigNumber(stroop)
                .times(BASE_FEE)
                .dividedBy(state.ExchangeRates.usd.rate)
                .toString()),
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(SummaryContent)
