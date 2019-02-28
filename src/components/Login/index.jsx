import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import {
    emailValid,
    passwordValid,
    rgb,
} from "../../lib/utils"
import { withLoginManager } from "../LoginManager"

import { withStyles } from "@material-ui/core/styles"

import { LinearProgress } from "@material-ui/core"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import { firebaseApp } from "../../components/StellarFox"
import { action as AlertAction } from "../../redux/Alert"




// <Login> component
export default compose(
    withStyles({

        barRoot: {
            height: "1px",
            marginBottom: "6px",
        },

        colorPrimary: {
            backgroundColor: rgb(15, 46, 83),
        },

        barColorPrimary: {
            backgroundColor: rgb(246, 190, 49),
        },

    }),
    withLoginManager,
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({
            showAlert: AlertAction.showAlert,
        }, dispatch)
    )
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
            emailInputValue: string.empty(),
            emailInputError: false,
            emailInputErrorTextValue: string.empty(),
            passwordInputValue: string.empty(),
            passwordInputError: false,
            passwordInputErrorTextValue: string.empty(),
        }


        // ...
        updateEmailInputValue = (event) => this.setState({
            emailInputValue: event.target.value,
            emailInputErrorTextValue: string.empty(),
            emailInputError: false,
        })


        // ...
        updatePasswordInputValue = (event) => this.setState({
            passwordInputValue: event.target.value,
            passwordInputErrorTextValue: string.empty(),
            passwordInputError: false,
        })


        // ...
        loginValidator = async () => {

            // INVALID EMAIL FORMAT
            if (!emailValid(this.state.emailInputValue)) {
                this.setState({
                    emailInputError: true,
                    emailInputErrorTextValue: "Invalid email format.",
                })
                return
            } else {
                this.setState({
                    emailInputError: false,
                    emailInputErrorTextValue: string.empty(),
                })
            }

            // INVALID PASSWORD LENGTH
            if (!passwordValid(this.state.passwordInputValue)) {
                this.setState({
                    passwordInputError: true,
                    passwordInputErrorTextValue: "Invalid password length.",
                })
                return
            } else {
                this.setState({
                    passwordInputError: false,
                    passwordInputErrorTextValue: string.empty(),
                })
            }

            // PROCEED WITH REQUEST
            this.setState(() => ({
                buttonDisabled: true,
                progressBarOpacity: 1,
            }))


            try {
                await firebaseApp.auth("session").signInWithEmailAndPassword(
                    this.state.emailInputValue,
                    this.state.passwordInputValue
                )
            } catch (error) {
                this.props.showAlert(error.message, "Error")
                this.setState(() => ({
                    buttonDisabled: false,
                    progressBarOpacity: 0,
                }))
                this.setState({
                    emailInputError: true,
                    emailInputErrorTextValue: error.message,
                })
                this.setState({
                    passwordInputError: true,
                    passwordInputErrorTextValue: error.message,
                })
                return
            }


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
            <div className="flex-box-col items-centered content-centered">
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
                
                <div>
                    <Button
                        onClick={this.loginValidator}
                        disabled={this.state.buttonDisabled}
                        color="secondary"
                        style={{ marginRight: "0px" }}
                    >Login</Button>
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            root: this.props.classes.barRoot,
                            colorPrimary: this.props.classes.colorPrimary,
                            barColorPrimary: this.props.classes.barColorPrimary,
                        }}
                        style={{
                            opacity: this.state.progressBarOpacity,
                            width: "100%",
                        }}
                    />
                </div>
                
            </div>
            

    }
)
