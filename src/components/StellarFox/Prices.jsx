import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { nativeToAsset } from "../../logic/assets"
import { Typography } from "@material-ui/core"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { stroop } from "../StellarFox/env"
import { BigNumber } from "bignumber.js"
import { BASE_FEE } from "stellar-sdk"




/**
 * Cygnus.
 *
 * Renders stand-alone Prices view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Prices>` component.
 *
 * @function Prices
 * @returns {React.ReactElement}
 */
const Prices = ({ classes, baseFeeUSD, halfLumenInUsd, usd }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <Fragment>
        <div className={classes.bg}>
            <TopHeadingContent />
        </div>
        <div className={isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgDark}` :
            `flex-box-row space-around ${classes.bgDark}`}
        >
            <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div className={isMobile ? "hero-mobile" : "hero-large"}>

                    <Typography variant={isMobile ? "h3" : "h1"} noWrap>
                        <span
                            style={{
                                color: "#c0c8d1",
                                lineHeight: isMobile ? "0.5rem" : "3rem",
                            }}
                        >
                            Prices
                        </span>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Cygnus Your Way
                    </Typography>


                    <Typography variant={ isMobile ? "h4" : "h3" } style={{
                        marginTop: isMobile ? "2rem" : "4rem",
                        marginBottom: isMobile ? "1rem" : "2rem",
                        color: "#c0c8d1",
                        lineHeight: "1rem",
                    }}
                    >
                        Fees Overview
                    </Typography>

                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Opening of new user account:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            0 USD
                        </Typography>
                    </div>
                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Monthly service fee:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            0 USD
                        </Typography>
                    </div>
                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Minimum reserve:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            {usd} USD
                        </Typography>
                    </div>
                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Profile signature:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            {halfLumenInUsd} USD
                        </Typography>
                    </div>
                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Payment data signature:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            {halfLumenInUsd} USD
                        </Typography>
                    </div>
                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Asset trustline:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            {halfLumenInUsd} USD
                        </Typography>
                    </div>
                    <div className="flex-box-row space-between tuple-secondary">
                        <Typography noWrap color="inherit" variant="caption">
                            Single operation fee:
                        </Typography>
                        <Typography noWrap color="inherit" variant="caption">
                            {baseFeeUSD} USD
                        </Typography>
                    </div>


                    <Typography
                        style={{
                            marginTop: isMobile ? "1rem" : "2rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        We will not charge new user account fee for a while, so
                        hurry up and get yours.
                    </Typography>





                </div>
            </div>
        </div>


        <AboutContent />
    </Fragment>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        bg: {
            backgroundColor: theme.palette.primary.light,
        },
        bgDark: {
            backgroundColor: theme.palette.primary.main,
        },
        bgLight: {
            backgroundColor: theme.palette.secondary.light,
        },
    })),
    connect(
        (state) => ({
            usd: nativeToAsset(
                1, state.ExchangeRates.usd.rate
            ),
            baseFeeUSD: (new BigNumber(stroop)
                .times(BASE_FEE)
                .dividedBy(state.ExchangeRates.usd.rate)
                .toString()),
            halfLumenInUsd: nativeToAsset(
                0.5, state.ExchangeRates.usd.rate
            ),
        }),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(Prices)
