import React, { Component, Fragment } from "react"
import Axios from "axios"

import md5 from "../../lib/md5"
import {
    emailValid,
    passwordValid,
    rgb,
    rgba,
} from "../../lib/utils"

import {
    Stepper,
    Step,
    StepLabel,
    StepContent
} from "material-ui/Stepper"

import Button from "../../lib/mui-v1/Button"
import InputField from "../../lib/common/InputField"
import LedgerAuthenticator from "../LedgerAuthenticator"

import { config } from "../../config"




// ...
const signupStyles = {

    stepLabel: { fontSize: "1rem", },

    errorStyle: { color: "#912d35", },

    underlineStyle: { borderColor: rgba(15, 46, 83, 0.9), },

    underlineFocusStyle: { borderColor: rgba(15, 46, 83, 0.7), },

    floatingLabelStyle: { color: rgba(15, 46, 83, 0.7), },

    floatingLabelFocusStyle: { color: rgba(15, 46, 83, 0.4), },

    inputStyle: { color: rgb(15, 46, 83), },

}




// <Signup> component
export default class Signup extends Component {

    // ...
    state = {
        stepIndex: 0,
        message: "",
        error: "",
        email: null,
        password: null,
        buttonDisabled: false,
    }


    // ...
    handleButtonAction = (action) => {
        const { stepIndex, } = this.state

        if (stepIndex === 0  &&  !this.validateInput()) {
            return false
        }

        this.setState({
            stepIndex: action === "next" ?
                (stepIndex + 1) : (stepIndex - 1),
        })

    }


    // ...
    createAccount = async (ledgerData) => {
        if (ledgerData.errorMessage) {
            return false
        }
        if (!ledgerData.errorCode) {
            try {
                const userResp = await Axios.post(`${config.api}/user/create/`,
                    {
                        email: this.state.email,
                        password: this.state.password,
                    }
                )

                await Axios
                    .post(
                        `${config.api}/account/create/${userResp.data.id
                        }/${ledgerData.publicKey}?path=${ledgerData.bip32Path
                        }&md5=${md5(this.state.email)}`
                    )

                const authResp = await Axios
                    .post(`${config.api}/user/authenticate/`, {
                        email: this.state.email,
                        password: this.state.password,
                    })

                this.setState({
                    message: "Your account has been created.",
                    buttonDisabled: true,
                })

                this.props.onComplete({
                    publicKey: ledgerData.publicKey,
                    bip32Path: ledgerData.bip32Path,
                    userId: userResp.data.id,
                    token: authResp.data.token,
                })
            } catch (error) {
                this.setState({
                    error: error.message,
                    buttonDisabled: false,
                })
            }
        }
    }


    // ...
    emailValidator = () => {
        emailValid(this.textInputFieldEmail.state.value) &&
        this.textInputFieldEmail.setState({
            error: "",
        })
    }


    // ...
    passwordValidator = () =>
        !passwordValid(this.textInputFieldPassword.state.value) &&
        this.textInputFieldPassword.setState({
            error: "",
        })


    // ...
    passwordMatchValidator = () =>
        (this.textInputFieldPassword.state.value ===
            this.textInputFieldPasswordConf.state.value) &&
        this.textInputFieldPasswordConf.setState({
            error: "",
        })


    // ...
    validateInput = () => {

        if (!emailValid(this.textInputFieldEmail.state.value)) {
            this.textInputFieldEmail.setState({
                error: "Invalid email format.",
            })
            return false
        }

        if (!passwordValid(this.textInputFieldPassword.state.value)) {
            this.textInputFieldPassword.setState({
                error: "Invalid password length.",
            })
            return false
        }

        if (
            this.textInputFieldPassword.state.value !==
            this.textInputFieldPasswordConf.state.value
        ) {
            this.textInputFieldPasswordConf.setState({
                error: "Passwords do not match.",
            })
            return false
        }

        this.setState({
            email: this.textInputFieldEmail.state.value,
            password: this.textInputFieldPassword.state.value,
        })
        return true
    }


    // ...
    render = () =>
        <Stepper
            connector={null}
            orientation="vertical"
            activeStep={this.state.stepIndex}
        >
            <Step>
                <StepLabel
                    style={{
                        fontSize: "1rem",
                    }}
                    icon={<i className="material-icons">person</i>}
                    iconContainerStyle={{
                        transform: "scale(1.4)",
                        marginRight: "-10px",
                    }}
                >
                    Set account access credentials.
                </StepLabel>
                <StepContent
                    style={{
                        borderLeft: "1px solid rgba(15,46,83,0.25)",
                        fontSize: "1rem",
                        color: "rgba(15,46,83,1)",
                        marginLeft: "20px",
                        marginBottom: "8px",
                    }}
                >
                    <div className="f-b">
                        <div className="f-b-col">
                            <InputField
                                name="register-email"
                                type="email"
                                placeholder="Email"
                                underlineStyle={signupStyles.underlineStyle}
                                underlineFocusStyle={
                                    signupStyles.underlineFocusStyle
                                }
                                floatingLabelStyle={
                                    signupStyles.floatingLabelStyle
                                }
                                floatingLabelFocusStyle={
                                    signupStyles.floatingLabelFocusStyle
                                }
                                inputStyle={signupStyles.inputStyle}
                                validator={this.emailValidator}
                                action={this.validateInput}
                                ref={(self) => { this.textInputFieldEmail = self }}
                            />
                            <InputField
                                name="register-password"
                                type="password"
                                placeholder="Password"
                                underlineStyle={signupStyles.underlineStyle}
                                underlineFocusStyle={
                                    signupStyles.underlineFocusStyle
                                }
                                floatingLabelStyle={
                                    signupStyles.floatingLabelStyle
                                }
                                floatingLabelFocusStyle={
                                    signupStyles.floatingLabelFocusStyle
                                }
                                inputStyle={signupStyles.inputStyle}
                                validator={this.passwordValidator}
                                action={this.validateInput}
                                ref={(self) => { this.textInputFieldPassword = self }}
                            />
                            <InputField
                                name="register-password-confirmation"
                                type="password"
                                placeholder="Password Confirmation"
                                underlineStyle={signupStyles.underlineStyle}
                                underlineFocusStyle={
                                    signupStyles.underlineFocusStyle
                                }
                                floatingLabelStyle={
                                    signupStyles.floatingLabelStyle
                                }
                                floatingLabelFocusStyle={
                                    signupStyles.floatingLabelFocusStyle
                                }
                                inputStyle={signupStyles.inputStyle}
                                validator={this.passwordMatchValidator}
                                action={this.validateInput}
                                ref={(self) => { this.textInputFieldPasswordConf = self }}
                                style={{ marginBottom: "15px", }}
                            />
                            <Button
                                color="primary"
                                onClick={this.handleButtonAction.bind(this, "next")}
                            >Next</Button>
                        </div>
                    </div>
                </StepContent>
            </Step>

            <Step>
                <StepLabel
                    style={{ fontSize: "1rem", }}
                    icon={<i className="material-icons">verified_user</i>}
                    iconContainerStyle={{
                        transform: "scale(1.4)",
                        marginRight: "-10px",
                    }}
                >
                    Authenticate with Ledger.
                </StepLabel>
                <StepContent
                    style={{
                        fontSize: "1rem",
                        color: "rgba(15,46,83,1)",
                    }}
                >
                    <div className="f-b">
                        <div className="f-b-col bordered m-t">
                            {this.props.config &&
                             this.props.config.useAsRegistrationForm ?
                                <Fragment>

                                    <div className="p-b tiny fade-strong">
                                        The following info will be lodged into our
                                        database to assiciate your email address with
                                        the chosen account sequence number:
                                    </div>
                                    <div className="f-b">
                                        <div className="p-r fade-strong">Email Address:</div>
                                        <div className="m-b">{this.state.email}</div>
                                    </div>
                                    <div className="f-b">
                                        <div className="p-r fade-strong">Account Sequence Index:</div>
                                        <div className="m-b">{this.props.config.bip32Path}</div>
                                    </div>
                                    <div className="p-b tiny fade-strong">
                                        Make sure your device is connected and Stellar
                                        Wallet application is selected. Click "Authenticate"
                                        button below to proceed further.
                                    </div>
                                    <Button
                                        onClick={this.createAccount.bind(this, {
                                            publicKey: this.props.config.publicKey,
                                            bip32Path: this.props.config.bip32Path,
                                        })}
                                        color="primary"
                                        fullWidth={true}
                                        disabled={this.state.buttonDisabled}
                                    >Authenticate</Button>
                                </Fragment> :
                                <LedgerAuthenticator
                                    className="lcars-input-reverse"
                                    onConnected={this.createAccount}
                                    onClick={null}
                                />
                            }
                        </div>
                    </div>
                    <div className="p-t">
                        <span className="placeholder-1rem">
                            <span className="success">
                                {this.state.message}
                            </span>
                            <span className="error">
                                {this.state.error}
                            </span>
                        </span>
                    </div>
                </StepContent>
            </Step>
        </Stepper>
}
