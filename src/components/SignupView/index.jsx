import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import Signup from "../Signup"




/**
 * Cygnus.
 *
 * Renders stand-alone signup view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<SignupView>` component.
 *
 * @function SignupView
 * @returns {React.ReactElement}
 */
const SignupView = ({ classes }) =>

    <Fragment>
        <div className={classes.bg}>
            <TopHeadingContent />
        </div>
        <div className="hero-no-shadow">
            <Signup />
        </div>
        <AboutContent />
    </Fragment>





// ...
export default func.compose(
    withStyles((theme) => ({
        bg: {
            backgroundColor: theme.palette.primary.light,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(SignupView)
