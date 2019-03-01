import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { action as ModalAction } from "../../redux/Modal"
import { Typography } from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { Link } from "react-router-dom"




/**
 * Cygnus.
 *
 * Renders top heading content.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<TopHeadingContent>` component.
 *
 * @function TopHeadingContent
 * @returns {React.ReactElement}
 */
const TopHeadingContent = ({ showModal }) => {
    const showSignupModal = () => showModal("signup"),
        isMobile = useMediaQuery("(max-width:960px)")

    return <div className="flex-box-row space-between">
        <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
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
            <div className="hero">
                <Button size="small" color="primary" component={Link} to="/login">
                    Sign In
                </Button>
            </div>
            <div className="hero">
                <Button
                    size="small"
                    color="secondary"
                    onClick={showSignupModal}
                >
                    Create Account
                </Button>
            </div>
        </div>
    </div>
}




// ...
export default func.compose(
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            showModal: ModalAction.showModal,
        }, dispatch),
    ),
)(TopHeadingContent)
