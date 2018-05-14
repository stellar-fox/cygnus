import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"

import { withLoginManager } from "../LoginManager"
import {
    emailIsValid,
    passwordIsValid,
} from "./helper"

import { withStyles } from "@material-ui/core/styles"

import { LinearProgress } from "@material-ui/core"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"




// <Login> component
export default compose(
    withStyles({

        barRoot: {
            height: "1px",
            marginBottom: "6px",
        },

        colorPrimary: {
            backgroundColor: "rgb(15, 46, 83)",
        },

        barColorPrimary: {
            backgroundColor: "rgb(246, 190, 49)",
        },

    }),
    withLoginManager
)(
    class Login extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            buttonDisabled: false,
            progressBarOpacity: 0,
            emailInputValue: "",
            emailInputError: false,
            emailInputErrorTextValue: "",
            passwordInputValue: "",
            passwordInputError: false,
            passwordInputErrorTextValue: "",
        }


        // ...
        updateEmailInputValue = (event) => this.setState({
            emailInputValue: event.target.value,
            emailInputErrorTextValue: "",
            emailInputError: false,
        })


        // ...
        updatePasswordInputValue = (event) => this.setState({
            passwordInputValue: event.target.value,
            passwordInputErrorTextValue: "",
            passwordInputError: false,
        })


        // ...
        loginValidator = async () => {

            // INVALID EMAIL FORMAT
            if (!emailIsValid(this.state.emailInputValue)) {
                this.setState({
                    emailInputError: true,
                    emailInputErrorTextValue: "Invalid email format.",
                })
                return
            } else {
                this.setState({
                    emailInputError: false,
                    emailInputErrorTextValue: "",
                })
            }

            // INVALID PASSWORD LENGTH
            if (!passwordIsValid(this.state.passwordInputValue)) {
                this.setState({
                    passwordInputError: true,
                    passwordInputErrorTextValue: "Invalid password length.",
                })
                return
            } else {
                this.setState({
                    passwordInputError: false,
                    passwordInputErrorTextValue: "",
                })
            }

            // PROCEED WITH REQUEST
            this.setState(() => ({
                buttonDisabled: true,
                progressBarOpacity: 1,
            }))

            this.props.loginManager.attemptLogin(
                this.state.emailInputValue,
                this.state.passwordInputValue
            ).then((auth) => {
                if (!auth.authenticated) {
                    this.setState(() => ({
                        buttonDisabled: false,
                        progressBarOpacity: 0,
                    }))
                    this.setState({
                        emailInputError: true,
                        emailInputErrorTextValue: auth.error,
                    })
                    this.setState({
                        passwordInputError: true,
                        passwordInputErrorTextValue: auth.error,
                    })
                }
            })

        }


        // ...
        render = () =>
            <Fragment>
                <div className="blockcenter" style={{ width: 256, }}>
                    <InputField
                        id="email-input"
                        type="email"
                        label="Email"
                        color="secondary"
                        error={this.state.emailInputError}
                        errorMessage={this.state.emailInputErrorTextValue}
                        onChange={this.updateEmailInputValue}
                    />
                    <InputField
                        id="password-input"
                        type="password"
                        label="Password"
                        color="secondary"
                        error={this.state.passwordInputError}
                        errorMessage={this.state.passwordInputErrorTextValue}
                        onChange={this.updatePasswordInputValue}
                    />
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            root: this.props.classes.barRoot,
                            colorPrimary: this.props.classes.colorPrimary,
                            barColorPrimary: this.props.classes.barColorPrimary,
                        }}
                        style={{ opacity: this.state.progressBarOpacity, }}
                    />
                    <Button
                        onClick={this.loginValidator}
                        disabled={this.state.buttonDisabled}
                        fullWidth={true}
                        color="secondary"
                    >Login</Button>
                </div>
            </Fragment>

    }
)
