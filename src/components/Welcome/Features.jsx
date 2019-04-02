import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
} from "@material-ui/core"
import AboutContent from "./AboutContent"
import TopHeadingContent from "./TopHeadingContent"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"




/**
 * Cygnus.
 *
 * Renders stand-alone Features view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Features>` component.
 *
 * @function Features
 * @returns {React.ReactElement}
 */
const Features = ({ classes }) => {
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

                    <Typography variant={isMobile ? "h3" : "h1"}>
                        <span
                            style={{
                                color: "#c0c8d1",
                                lineHeight: isMobile ? "0.5rem" : "3rem",
                            }}
                        >
                            Transact smarter. Faster. Easier.
                        </span>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Features Overview
                    </Typography>

                    <Typography
                        variant={isMobile ? "h4" : "h3"}
                        style={{
                            marginTop: "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Cygnus empowers you to transact with confidence and
                        speed that no traditional bank can match.
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

                    <Typography variant={isMobile ? "h3" : "h1"}>
                        <span
                            style={{
                                color: "#c0c8d1",
                                lineHeight: isMobile ? "0.5rem" : "3rem",
                            }}
                        >
                            The Essentials
                        </span>
                    </Typography>

                    <div className={isMobile ?
                        "flex-box-col content-centered items-centered" :
                        "flex-box-row space-around"}
                    >

                        <Card className={isMobile ? classes.cardMobile : classes.card}>
                            <CardHeader
                                title="Comprehensive Security"
                                classes={{ title: classes.title }}
                            />
                            <CardContent>
                                <Typography
                                    color="primary"
                                    gutterBottom
                                >
                                    <b>No secrets revealed. Ever.</b>
                                </Typography>
                                <Typography
                                    color="primary"
                                    gutterBottom
                                >
                                    We will never ask you to provide your
                                    signing keys and the only way you can sign
                                    is with your hardware device.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card className={isMobile ? classes.cardMobile : classes.card}>
                            <CardHeader
                                title="Low Fees"
                                classes={{ title: classes.title }}
                            />
                            <CardContent>
                                <Typography
                                    color="primary"
                                    gutterBottom
                                >
                                    <b>Fractional cost to you and volume independent.</b>
                                </Typography>
                                <Typography
                                    color="primary"
                                    gutterBottom
                                >
                                    No matter if you send a fraction of a penny
                                    or a million dollars, the fee always stays
                                    the same.
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card className={isMobile ? classes.cardMobile : classes.card}>
                            <CardHeader
                                title="Ease of Use"
                                classes={{ title: classes.title }}
                            />
                            <CardContent>
                                <Typography
                                    color="primary"
                                    gutterBottom
                                >
                                    <b>Traditional banking features that you know.</b>
                                </Typography>
                                <Typography
                                    color="primary"
                                    gutterBottom
                                >
                                    We try to merge the complex world of cryptography
                                    with traditional financial instruments and
                                    features that most users are already
                                    familiar with.
                                </Typography>
                            </CardContent>
                        </Card>

                    </div>

                    <Typography variant={ isMobile ? "h3" : "h1" } style={{
                        marginTop: isMobile ? "1rem" : "3rem",
                        color: "#c0c8d1",
                        lineHeight: isMobile ? "2rem" : "5rem",
                    }}
                    >
                    Take your banking to the next level.
                    </Typography>


                    <Typography variant={ isMobile ? "h4" : "h3" } style={{
                        marginTop: "2rem",
                        marginBottom: isMobile ? "0rem" : "1rem",
                        color: "#c0c8d1",
                        lineHeight: "1rem",
                    }}
                    >
                        Smart Contact Book
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Send payments to your contacts. Easily find every contact
                        by name, payment address or account number.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Add contact by payment address, account number or send
                        an email invite.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Search for contacts with federated providers.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Contact profiles are securely signed.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Choose preferred currency for each contact.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Choose memo for federated contacts.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Set your own memo to receive payments with it.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Turn on/off your payment address public listing.
                    </Typography>


                    <Typography variant={ isMobile ? "h4" : "h3" } style={{
                        marginTop: "2rem",
                        marginBottom: isMobile ? "0rem" : "1rem",
                        color: "#c0c8d1",
                        lineHeight: "1rem",
                    }}
                    >
                        Gorgeous Paychecks
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Send currency payments or other assets with
                        beautifully designed paychecks of your choice.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Enjoy security features embedded with each paycheck.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Automatic exchange rate calculation when recipient has
                        different currency.
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Custom or default memo for each transaction.
                    </Typography>

                    <Typography variant={ isMobile ? "h4" : "h3" } style={{
                        marginTop: "2rem",
                        marginBottom: isMobile ? "0rem" : "1rem",
                        color: "#c0c8d1",
                        lineHeight: "1rem",
                    }}
                    >
                        Signed User Profiles
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • Optionally sign your user profile to verify identity
                        and provide destination guarantee to the sender.
                    </Typography>

                    <Typography variant={ isMobile ? "h4" : "h3" } style={{
                        marginTop: "2rem",
                        marginBottom: isMobile ? "0rem" : "1rem",
                        color: "#c0c8d1",
                        lineHeight: "1rem",
                    }}
                    >
                        Asset History
                    </Typography>
                    <Typography
                        style={{
                            marginTop: "0.5rem",
                            lineHeight: isMobile ? "1.2rem" : "1.2rem",
                        }}
                        variant={ isMobile ? "body2" : "body1" }
                        color="secondary"
                    >
                        • View transaction history with live exchange rates.
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
        card: {
            borderRadius: "2px",
            marginTop: "1rem",
            marginRight: "1rem",
            "&:last-child": {
                marginRight: 0,
            },
        },
        cardMobile: {
            borderRadius: "2px",
            margin: "0.5rem 0rem",
        },
        title: {
            fontSize: "1.1rem",
            color: theme.palette.primary.light,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(Features)
