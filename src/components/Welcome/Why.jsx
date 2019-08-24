import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import whyCygnus from "../StellarFox/static/whyCygnus.png"




/**
 * Cygnus.
 *
 * Renders stand-alone "why" view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Why>` component.
 *
 * @function Why
 * @returns {React.ReactElement}
 */
const Why = ({ classes }) => {
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

                    <div className="flex-box-col m-b-large">
                        <img
                            style={{ opacity: "0.4" }}
                            src={whyCygnus}
                            width={ isMobile ? "250px" : "350px"}
                            alt="Why Cygnus?"
                        />

                        <Typography variant="h1" noWrap>
                            <span style={{ color: "#c0c8d1", lineHeight: "3.5rem"}}>
                                Why Cygnus?
                            </span>
                        </Typography>
                        <Typography variant="body2" color="secondary">
                            20 seconds pitch
                        </Typography>
                    </div>

                    <Typography variant="body1"
                        style={{
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We designed this wallet with two major goals.
                        It had to be simple enough so even your parents could
                        use it and it had to provide enough security for the
                        user so the funds could not be easily extracted by a
                        malicious party.

                        This is a first "social" wallet with fully integrated
                        contact book equipped with cryptographic signatures.
                        This allows each user to have their own
                        unique payment address and ensures that the payment
                        address is really the address of the person who claims
                        it. With just a click of a button you can add your
                        destination contact and send them money.

                        Your funds are always safe as you sign all your
                        transactions with the hardware key ring, which keeps
                        your keys securely.
                    </Typography>
                </div>
            </div>
        </div>

        <div className={isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgDark}` :
            `flex-box-row space-around ${classes.bgDark}`}
        >
            <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div className={isMobile ? "hero-mobile" : "hero-large"}>

                    <div className="flex-box-col m-b-large">
                        <Typography variant="h1" noWrap>
                            <span style={{ color: "#c0c8d1", lineHeight: "3.5rem"}}>
                                Who we are
                            </span>
                        </Typography>
                    </div>
                    <Typography variant="body1"
                        style={{
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Recognizing the importance of Stellar network from the
                        onset, and understanding the significance of the global
                        protocol for moving value across borders, we developed
                        Cygnus to give people the means to quickly and securely
                        open an account and start using cryptocurrency. We also
                        wanted for the users to experience for the first time
                        how easy it is to manage and control your investments
                        with this technology.
                    </Typography>
                </div>
            </div>
        </div>
        <div className={isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgDark}` :
            `flex-box-row space-around ${classes.bgDark}`}
        >
            <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div className={isMobile ? "hero-mobile" : "hero-large"}>

                    <div className="flex-box-col m-b-large">
                        <Typography
                            variant={isMobile ? "h4" : "h1"}
                            color="secondary"
                            style={{ lineHeight: 1.3 }}
                        >
                            Our mission is to accelerate adoption of Stellar
                            ecosystem and protocol so that you and the
                            rest of the World can achieve financial inclusion
                            and true financial freedom.
                        </Typography>
                    </div>

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
)(Why)
