import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { Typography } from "@material-ui/core"




/**
 * Cygnus.
 *
 * Renders error message.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<ErrorMessage>` component.
 *
 * @function ErrorMessage
 * @returns {React.ReactElement}
 */
const ErrorMessage = ({
    className,
    emailInputError,
    emailInputErrorMessage,
    passwordInputError,
    passwordInputErrorMessage,
    style,
}) => {

    return <div style={style} className={`flex-box-row space-around ${className}`}>
        {emailInputError &&
        <Typography variant="caption">
            <span className="red">{emailInputErrorMessage}</span>
        </Typography>}
        {passwordInputError &&
        <Typography variant="caption">
            <span className="red">{passwordInputErrorMessage}</span>
        </Typography>}
    </div>
}




// ...
export default func.compose(
    connect(
        (state) => ({
            emailInputError: state.Errors.emailInputError,
            emailInputErrorMessage: state.Errors.emailInputErrorMessage,
            passwordInputError: state.Errors.passwordInputError,
            passwordInputErrorMessage: state.Errors.passwordInputErrorMessage,
        }),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(ErrorMessage)
