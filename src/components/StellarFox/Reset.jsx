import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Panel from "../../lib/mui-v1/Panel"
import {
    LinearProgress,
    Typography,
} from "@material-ui/core"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import StatusMessage from "../StatusMessage"
import { sendPasswordResetLink } from "../../thunks/users"
import { surfaceSnacky } from "../../thunks/main"



/**
 * Cygnus.
 *
 * Renders stand-alone Reset view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */





/**
 * `<Reset>` component.
 *
 * @function Reset
 * @returns {React.ReactElement}
 */
const Reset = ({ classes, emailInputError, sendPasswordResetLink, surfaceSnacky }) => {
    const isMobile = useMediaQuery("(max-width:960px)"),
        [inProgress, setInProgress] = React.useState(false),
        [email, setEmail] = React.useState(),
        [complete, setComplete] = React.useState(false),
        handleInputChange = async (e) => await setEmail(e.target.value),
        handleButtonClick = async () => {
            try {
                await setInProgress(true)
                await sendPasswordResetLink(email)
                await setInProgress(false)
                await setComplete(true)
            } catch (error) {
                await surfaceSnacky(
                    "error",
                    "Could not send password reset link."
                )
                await setComplete(false)
            } finally {
                await setInProgress(false)
            }

        }


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

                    <Panel
                        style={{ minHeight: 300, maxWidth: isMobile ? 250 : 450, minWidth: isMobile ? 250 : 450 }}
                        title="Get password reset link."
                    >
                        { complete ?
                            <Fragment>
                                <Typography
                                    style={{ marginTop: "1rem" }}
                                    color="secondary"
                                    variant="body1"
                                    align="center"
                                    display="block"
                                >
                                    Your password reset link is on the way.
                                </Typography>
                                <Typography
                                    color="secondary"
                                    variant="body2"
                                    align="center"
                                    display="block"
                                >
                                    Please check your mailbox.
                                </Typography>
                            </Fragment> :
                            <Fragment>
                                <div className="hero m-t-small panel-title">
                                    Provide your email address where we should
                                    send your password reset link.
                                </div>

                                <div className="flex-box-col items-centered content-centered">
                                    <InputField
                                        id="email-input"
                                        type="email"
                                        label="Email"
                                        color="secondary"
                                        error={emailInputError}
                                        onChange={handleInputChange}
                                    />
                                    <div>
                                        <Button
                                            onClick={handleButtonClick}
                                            color="secondary"
                                            style={{ marginRight: "0px" }}
                                            disabled={inProgress}
                                        >Send Link
                                        </Button>
                                        <LinearProgress
                                            variant="indeterminate"
                                            classes={{
                                                colorPrimary: classes.linearColorPrimary,
                                                barColorPrimary: classes.linearBarColorPrimary,
                                            }}
                                            style={{
                                                width: "100%",
                                                opacity: inProgress ? 1 : 0,
                                            }}
                                        />
                                    </div>
                                    <StatusMessage className="m-t" style={{ minHeight: "20px" }} />
                                </div>
                            </Fragment>
                        }
                    </Panel>
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
        linearColorPrimary: {
            marginTop: "2px",
            backgroundColor: theme.palette.secondary.light,
            borderRadius: "3px",
        },
        linearBarColorPrimary: {
            backgroundColor: theme.palette.secondary.dark,
            borderRadius: "3px",
        },
    })),
    connect(
        (state) => ({
            emailInputError: state.Errors.emailInputError,
        }),
        (dispatch) => bindActionCreators({
            sendPasswordResetLink,
            surfaceSnacky,
        }, dispatch),
    ),
)(Reset)
