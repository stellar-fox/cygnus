import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    func,
    shorten,
    string,
} from "@xcmats/js-toolbox"
import {
    Typography,
} from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { LinearProgress } from "@material-ui/core"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import {
    signIn,
    signUpNewUser,
} from "../../thunks/users"
import StatusMessage from "../StatusMessage"






// ...
const CredentialsForm = func.compose(


    withStyles((theme) => ({
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
            passwordInputError: state.Errors.passwordInputError,
            signingUp: state.Progress.signup.inProgress,
            signingIn: state.Progress.signin.inProgress,
        }),
        (dispatch) => bindActionCreators({
            signIn,
            signUpNewUser,
        }, dispatch),
    ),


)((props) => {

    const [email, setEmail] = React.useState(string.empty()),
        [password, setPassword] = React.useState(string.empty()),
        updateEmailInputValue = (event) => setEmail(event.target.value),
        updatePasswordInputValue = (event) => setPassword(event.target.value),

        handleButtonClick = () => {
            props.accountId && props.account ?
                props.signUpNewUser(
                    props.accountId, props.account, email, password
                ) :
                props.signIn(email, password)
        }


    return <div>
        {props.accountId && props.account &&
        <Fragment>
            <Typography align="center" variant="caption" color="secondary">
                Signing up with Account ID:
            </Typography>
            <div className="m-t-small panel-title">
                {shorten(props.accountId, 11, shorten.MIDDLE, "-")}
            </div>
            <Typography align="center" variant="caption" color="secondary">
                Account:
            </Typography>
            <div className="m-t-small panel-title">
                {props.account}
            </div>
        </Fragment>}
        <div className="flex-box-col items-centered content-centered">
            <InputField
                id="email-input"
                type="email"
                label="Email"
                color="secondary"
                error={props.emailInputError}
                onChange={updateEmailInputValue}
            />
            <InputField
                id="password-input"
                type="password"
                label="Password"
                color="secondary"
                error={props.passwordInputError}
                onChange={updatePasswordInputValue}
            />
            <div>
                <Button
                    onClick={handleButtonClick}
                    color="secondary"
                    style={{ marginRight: "0px" }}
                    disabled={props.signingUp || props.signingIn}
                >{props.accountId && props.account ? "Sign Up" : "Sign In"}
                </Button>
                <LinearProgress
                    variant="indeterminate"
                    classes={{
                        colorPrimary: props.classes.linearColorPrimary,
                        barColorPrimary: props.classes.linearBarColorPrimary,
                    }}
                    style={{
                        width: "100%",
                        opacity: props.signingUp || props.signingIn ? 1 : 0,
                    }}
                />
            </div>
            <StatusMessage className="m-t" style={{ minHeight: "20px" }} />
        </div>
    </div>
})




// ...
export default CredentialsForm
