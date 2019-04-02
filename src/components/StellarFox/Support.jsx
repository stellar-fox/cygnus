import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    Link,
    Typography,
} from "@material-ui/core"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"




/**
 * Cygnus.
 *
 * Renders stand-alone Support view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Support>` component.
 *
 * @function Support
 * @returns {React.ReactElement}
 */
const Support = ({ classes }) => {
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
                            Support
                        </span>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Contact Us
                    </Typography>


                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        If you have any issues, comments or need help please
                        write us at <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="/pgp.txt"
                            underline="none"
                            color="secondary"
                        >
                        contact@stellarfox.net
                        </Link>.
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
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(Support)
