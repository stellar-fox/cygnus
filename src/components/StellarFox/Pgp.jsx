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
import useMediaQuery from "@material-ui/core/useMediaQuery"




/**
 * Cygnus.
 *
 * Renders stand-alone Pgp view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Pgp>` component.
 *
 * @function Pgp
 * @returns {React.ReactElement}
 */
const Pgp = ({ classes }) => {
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
                            PGP Key
                        </span>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Support
                    </Typography>


                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We use PGP (Pretty Good Privacy) data encryption
                        and Keybase.io for providing privacy and authentication
                        of our communication with you. We strongly advise you
                        use this encryption tool or Keybase.io to ensure a
                        secure delivery of your messages. To download our
                        public PGP encryption key please follow the link to
                        our <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="/pgp.txt"
                            underline="none"
                            color="secondary"
                        >
                        PGP Key
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
)(Pgp)
