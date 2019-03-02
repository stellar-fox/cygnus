import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { action as ModalAction } from "../../redux/Modal"
import { Typography } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import Button from "../../lib/mui-v1/Button"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { Link } from "react-router-dom"
import AboutContent from "../Welcome/AboutContent"
import LoginChoices from "../Welcome/LoginChoices"





/**
 * Cygnus.
 *
 * Renders stand-alone login view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<LoginView>` component.
 *
 * @function LoginView
 * @returns {React.ReactElement}
 */
const LoginView = ({ classes, showModal }) => {
    const showSignupModal = () => showModal("signup"),
        isMobile = useMediaQuery("(max-width:960px)")

    return <Fragment><div className={`${classes.bg} flex-box-row space-between`}>
        <div className={isMobile ? "flex-box-col" : "flex-box-row hero-no-shadow"}>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                Why Cygnus
            </Typography>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                Features
            </Typography>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                Prices
            </Typography>
            <Typography className="hero" style={{ fontSize: 14 }} color="secondary">
                Support
            </Typography>
        </div>
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
            <div className="hero-no-shadow">
                <Button
                    size="small"
                    color="primaryDark"
                    component={Link}
                    to="/login"
                >
                    Sign In
                </Button>
            </div>
            <div className="hero-no-shadow">
                <Button
                    size="small"
                    color="secondaryLight"
                    onClick={showSignupModal}
                >
                    Create Account
                </Button>
            </div>
        </div>
    </div>

    <div className="hero-no-shadow">
        <LoginChoices />
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
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            showModal: ModalAction.showModal,
        }, dispatch),
    ),
)(LoginView)
