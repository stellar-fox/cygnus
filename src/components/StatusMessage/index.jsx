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
    ledgerauthStatusMessage,
    passwordInputError,
    passwordInputErrorMessage,
    signupStatusMessage,
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
    
    {ledgerauthStatusMessage && <Typography color="secondary" variant="caption">
        {ledgerauthStatusMessage}
    </Typography>}

    {signupStatusMessage && <Typography color="secondary" variant="caption">
        {signupStatusMessage}
    </Typography>}
</div>




// ...
export default func.compose(
    connect(
        (state) => ({
            emailInputError: state.Errors.emailInputError,
            emailInputErrorMessage: state.Errors.emailInputErrorMessage,
            passwordInputError: state.Errors.passwordInputError,
            passwordInputErrorMessage: state.Errors.passwordInputErrorMessage,
            signupStatusMessage: state.Progress.signup.statusMessage,
            ledgerauthStatusMessage: state.Progress.ledgerauth.statusMessage,
        }),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(StatusMessage)
