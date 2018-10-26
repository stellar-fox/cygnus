import React, { Component, Fragment } from "react"
import Axios from "axios"

import { bindActionCreators } from "redux"
import { string } from "@xcmats/js-toolbox"

import md5 from "../../lib/md5"
import {
    emailValid,
    htmlEntities as he,
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

import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "../../lib/mui-v1/Button"
import InputField from "../../lib/common/InputField"
import LedgerAuthenticator from "../LedgerAuthenticator"

import { config } from "../../config"
import { withStyles } from "@material-ui/core/styles"

import { firebaseApp } from "../../components/StellarFox"
import connect from "react-redux/lib/connect/connect"
import { action as AccountAction } from "../../redux/Account"
import { action as AlertAction } from "../../redux/Alert"
import { action as ModalAction } from "../../redux/Modal"
import { subscribeEmail } from "./api"
import { Typography } from "@material-ui/core"




// ...
const signupStyles = {

    stepLabel: { fontSize: "1rem" },

    errorStyle: { color: "#912d35" },

    underlineStyle: { borderColor: rgba(15, 46, 83, 0.9) },

    underlineFocusStyle: { borderColor: rgba(15, 46, 83, 0.7) },

    floatingLabelStyle: { color: rgba(15, 46, 83, 0.7) },

    floatingLabelFocusStyle: { color: rgba(15, 46, 83, 0.4) },

    inputStyle: { color: rgb(15, 46, 83) },

}




// ...
const styles = (_theme) => ({
    progress: {},
})




// ...
const RequestProgress = withStyles(styles)(
    ({ classes, color }) =>
        <CircularProgress color={color || "secondary"}
            className={classes.progress}
            thickness={4} size={20}
        />
)




// <Signup> component
class Signup extends Component {

    // ...
    state = {
        stepIndex: 0,
        message: string.empty(),
        error: string.empty(),
        email: null,
        password: null,
        buttonDisabled: false,
        loading: false,
    }


    // ...
    handleButtonAction = async (action) => {
        const { stepIndex } = this.state

        if (stepIndex === 0  &&  !this.validateInput()) {
            return
        }

        await this.setState({
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
                await this.setState({
                    message: "Creating your account ...",
                    loading: true,
                    buttonDisabled: true,
                })
                await firebaseApp.auth("session").createUserWithEmailAndPassword(
                    this.state.email,
                    this.state.password
                )
            } catch (error) {
                await this.setState({
                    loading: false,
                    buttonDisabled: false,
                })
                this.props.hideModal()
                this.props.showAlert(error.message, "Error")
                return
            }

            try {

                const userResp = await Axios.post(
                    `${config.apiV2}/user/create/`, {
                        email: this.state.email,
                        password: this.state.password,
                        token: (await firebaseApp.auth("session")
                            .currentUser.getIdToken()),
                    }
                )

                await Axios
                    .post(`${config.api}/account/create/`, {
                        user_id: userResp.data.userid,
                        pubkey: ledgerData.publicKey,
                        path: ledgerData.bip32Path,
                        email_md5: md5(this.state.email),
                    })

                const authResp = await Axios
                    .post(`${config.api}/user/authenticate/`, {
                        email: this.state.email,
                        password: this.state.password,
                    })

                await subscribeEmail(
                    userResp.data.userid,
                    authResp.data.token,
                    this.state.email
                )

                await firebaseApp.auth("session")
                    .currentUser.sendEmailVerification()

                await this.setState({
                    message: "Your account has been created.",
                    loading: false,
                })

                await this.props.onComplete({
                    publicKey: ledgerData.publicKey,
                    bip32Path: ledgerData.bip32Path,
                    userId: userResp.data.userid,
                    token: authResp.data.token,
                })

                // update Account Redux data
                await this.props.setState({
                    email: this.state.email,
                    gravatar: md5(this.state.email),
                    needsRegistration: false,
                })

            } catch (error) {

                this.setState({
                    error: error.message,
                    buttonDisabled: false,
                    loading: false,
                })

            }
        }
    }


    // ...
    emailValidator = () => {
        emailValid(this.textInputFieldEmail.state.value) &&
        this.textInputFieldEmail.setState({ error: string.empty() })
    }


    // ...
    passwordValidator = () =>
        !passwordValid(this.textInputFieldPassword.state.value) &&
        this.textInputFieldPassword.setState({ error: string.empty() })


    // ...
    passwordMatchValidator = () =>
        (this.textInputFieldPassword.state.value ===
            this.textInputFieldPasswordConf.state.value) &&
        this.textInputFieldPasswordConf.setState({ error: string.empty() })


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
                                style={{ marginBottom: "15px" }}
                            />

                            <Button
                                color="primary"
                                onClick={this.handleButtonAction.bind(this, "next")}
                            >
                                {this.state.loading ? <RequestProgress /> : "Next"}
                            </Button>

                        </div>
                    </div>
                </StepContent>
            </Step>

            <Step>
                <StepLabel
                    style={{ fontSize: "1rem" }}
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

                    <div className="p-t f-b-c">
                        {this.state.loading ?
                            <Fragment>
                                <RequestProgress color="primary" />
                                <he.Nbsp /><he.Nbsp /><he.Nbsp /><he.Nbsp />
                                <Typography variant="body1" color="primary">
                                    {this.state.message}
                                </Typography>
                            </Fragment> : this.state.error ?
                                <Typography variant="body1">
                                    <span className="error">
                                        {this.state.error}
                                    </span>
                                </Typography> :
                                <Typography variant="body1" color="primary">
                                    {this.state.message}<he.Nbsp />
                                </Typography>
                        }
                    </div>
                </StepContent>
            </Step>
        </Stepper>
}


// ...
export default connect(
    null,
    (dispatch) => bindActionCreators({
        setState: AccountAction.setState,
        showAlert: AlertAction.showAlert,
        hideModal: ModalAction.hideModal,
    }, dispatch)
)(Signup)
