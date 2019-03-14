import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { Typography } from "@material-ui/core"




/**
 * Cygnus.
 *
 * Renders status message of specified type.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<StatusMessage>` component.
 *
 * @function StatusMessage
 * @returns {React.ReactElement}
 */
const StatusMessage = ({
    className,
    emailInputError,
    emailInputErrorMessage,
    ledgerauthInProgress,
    ledgerauthStatusMessage,
    passwordInputError,
    passwordInputErrorMessage,
    signinInProgress,
    signinStatusMessage,
    signupInProgress,
    signupStatusMessage,
    otherError,
    otherErrorMessage,
    style,
}) => <div style={style} className={`flex-box-row space-around ${className}`}>

    {emailInputError &&
        <Typography variant="caption">
            <span className="red">{emailInputErrorMessage}</span>
        </Typography>}

    {passwordInputError &&
        <Typography variant="caption">
            <span className="red">{passwordInputErrorMessage}</span>
        </Typography>}

    {ledgerauthInProgress && <Typography color="secondary" variant="caption">
        {ledgerauthStatusMessage}
    </Typography>}

    {signupInProgress && <Typography color="secondary" variant="caption">
        {signupStatusMessage}
    </Typography>}

    {signinInProgress && <Typography color="secondary" variant="caption">
        {signinStatusMessage}
    </Typography>}

    {otherError && <Typography color="secondary" variant="caption">
        <span className="red">{otherErrorMessage}</span>
    </Typography>}

</div>




// ...
export default func.compose(
    connect(
        (state) => ({
            emailInputError: state.Errors.emailInputError,
            emailInputErrorMessage: state.Errors.emailInputErrorMessage,
            otherError: state.Errors.otherError,
            otherErrorMessage: state.Errors.otherErrorMessage,
            passwordInputError: state.Errors.passwordInputError,
            passwordInputErrorMessage: state.Errors.passwordInputErrorMessage,
            signinInProgress: state.Progress.signin.inProgress,
            signinStatusMessage: state.Progress.signin.statusMessage,
            signupInProgress: state.Progress.signup.inProgress,
            signupStatusMessage: state.Progress.signup.statusMessage,
            ledgerauthInProgress: state.Progress.ledgerauth.inProgress,
            ledgerauthStatusMessage: state.Progress.ledgerauth.statusMessage,
        }),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(StatusMessage)
