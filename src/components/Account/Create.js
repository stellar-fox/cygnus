import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"

import {
    emailValid,
    passwordValid,
    extractPathIndex,
} from "../../lib/utils"
import { appName } from "../../env"
import md5 from "../../lib/md5"
import { config } from "../../config"

import {
    accountExistsOnLedger,
    accountMissingOnLedger,
    logIn,
    setAccountRegistered,
    setAccountPath,
    setLedgerSoftwareVersion,
    setPublicKey,
    changeLoginState,
    ActionConstants,
} from "../../actions"

import LedgerAuthenticator from "../LedgerAuthenticator"
import InputField from "../../frontend/InputField"
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from "material-ui/Stepper"
import LinearProgress from "material-ui/LinearProgress"
import Button from "../../frontend/Button"




// <NewAccount> component
class NewAccount extends Component {

    // ...
    state = {
        finished: false,
        stepIndex: 0,
        email: "",
        password: "",
        accountCreated: false,
        progressCompleted: 0,
        progressText: "",
        progressError: "",
    }


    // ...
    handleNext = () => {
        const { stepIndex, } = this.state

        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        })

        if (stepIndex >= 2) {
            this.props.onComplete({
                loginState: ActionConstants.LOGGED_IN,
                publicKey: this.props.appAuth.publicKey,
                bip32Path: this.props.appAuth.bip32Path,
                userId: this.props.appAuth.userId,
                token: this.props.appAuth.token,
            })
        }
    }


    // ...
    handlePrev = () => {
        const { stepIndex, } = this.state

        if (stepIndex > 0) {
            this.setState({
                stepIndex: stepIndex - 1,
            })
        }
    }


    // ...
    progress = (completed) => {
        if (completed > 100) {
            this.setState({
                completed: 100,
            })
        } else {
            this.setState({completed,})
        }
    }


    // ...
    createAccount = async (ledgerData) => {

        if (ledgerData.errorCode) {
            return false
        }

        const userId = await axios
            .post(`${config.api}/user/create/`, {
                email: this.state.email,
                password: this.state.password,
            })
            .then((response) => {
                return response.data.id
            })
            .catch((error) => {
                this.setState({
                    progressError: error.message,
                })
                // eslint-disable-next-line no-console
                console.log(error)
                return null
            })

        if (userId) {
            const accountId = await axios
                .post(
                    `${config.api}/account/create/${
                        userId
                    }/${ledgerData.publicKey}?path=${
                        extractPathIndex(ledgerData.bip32Path)
                    }&md5=${md5(this.state.email)}`
                )
                .then((response) => {
                    return response.data.account_id
                })
                .catch((error) => {
                    this.setState({
                        progressError: error.message,
                    })
                    // eslint-disable-next-line no-console
                    console.log(error)
                    return null
                })

            if (accountId) {
                this.setState({
                    accountCreated: true,
                    completed: 100,
                })
            }
        }

        await axios
            .post(`${config.api}/user/authenticate/`, {
                email: this.state.email,
                password: this.state.password,
            })
            .then((response) => {
                this.props.setAccountRegistered(true)
                this.props.changeLoginState({
                    publicKey: response.data.pubkey,
                    bip32Path: response.data.bip32Path,
                    userId: response.data.user_id,
                    token: response.data.token,
                })
                return response
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error)
            })

        this.handleNext.call(this)

    }


    // ...
    renderStepActions = (step) => {

        return (
            <div style={{ margin: "12px 0", }}>

                {step === 0 && (
                    <Button
                        label="Next"
                        primary={true}
                        onClick={this.handleNext.bind(this)}
                    />
                )}

                {step === 1 && (
                    <Fragment>
                        <Button
                            label="Next"
                            primary={true}
                            onClick={this.compoundValidate.bind(this)}
                        />
                        <span className="p-l"></span>
                        <Button
                            label="Back"
                            flat={true}
                            onClick={this.handlePrev.bind(this)}
                        />
                    </Fragment>
                )}

                {step === 2 && (
                    <Fragment>
                        <div className="dark">
                            <div className="p-b-small">
                                <span className="credit">
                                    {this.state.email}
                                </span>
                            </div>
                            <div className="small">
                                will be associated with your Ledger device.
                            </div>

                            <div className="p-t small">
                                While your device is connected,
                                choose Stellar wallet,
                                make sure that wallet web support is enabled
                                and press "Authenticate" button below.
                                Your account will be created instantly.
                            </div>
                            <LedgerAuthenticator
                                className="p-t"
                                onConnected={this.createAccount.bind(this)}
                                onClick={this.handleNext.bind(this)}
                            />
                        </div>
                        <div className="p-t"></div>
                        <Button
                            label="Back"
                            flat={true}
                            onClick={this.handlePrev.bind(this)}
                        />
                        <div className="p-b-small"></div>
                        <LinearProgress
                            style={{background: "rgb(244,176,4)",}}
                            color="rgba(15,46,83,0.6)"
                            mode="determinate"
                            value={this.state.completed}
                        />
                        <div className="tiny">
                            <div className="p-b-small-block">
                                {this.state.progressText}
                            </div>
                        </div>
                    </Fragment>
                )}
            </div>
        )
    }


    // ...
    emailValidator = (email) =>
        !emailValid(email) ? "invalid email" : null


    // ...
    passwordValidator = (password) =>
        !passwordValid(password) ? "invalid password" : null


    // ...
    compoundValidate = () => {
        let proceed = true

        if (!emailValid(this.textInputFieldEmail.state.value)) {
            this.textInputFieldEmail.setState({
                error: "invalid email",
            })
            proceed = false
        }

        if (!passwordValid(this.textInputFieldPassword.state.value)) {
            this.textInputFieldPassword.setState({
                error: "invalid password",
            })
            proceed = false
        }

        if (
            this.textInputFieldPassword.state.value !==
                this.textInputFieldPasswordConf.state.value
        ) {
            this.textInputFieldPasswordConf.setState({
                error: "password mismatch",
            })
            proceed = false
        }

        if (proceed) {
            this.setState({
                email: this.textInputFieldEmail.state.value,
                password: this.textInputFieldPassword.state.value,
            })
            this.handleNext.call(this)
        }
    }


    // ...
    render = () => {
        const { finished, stepIndex, } = this.state,
            styles = {
                stepLabel: {
                    fontSize: "1rem",
                },
                errorStyle: {
                    color: "#912d35",
                },
                underlineStyle: {
                    borderColor: "rgba(15,46,83,0.9)",
                },
                underlineFocusStyle: {
                    borderColor: "rgba(15,46,83,0.7)",
                },
                floatingLabelStyle: {
                    color: "rgba(15,46,83,0.7)",
                },
                floatingLabelFocusStyle: {
                    color: "rgba(15,46,83,0.4)",
                },
                inputStyle: {
                    color: "rgb(15,46,83)",
                },
            }

        return (
            <div style={{ maxWidth: 480, maxHeight: 480, margin: "auto", }}>
                <Stepper connector={null} activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={
                            <i className="material-icons">perm_identity</i>
                        }>
                            About your account
                        </StepLabel>
                        <StepContent style={{ borderLeft: "1px solid rgba(15,46,83,0.2)", }}>
                            <div className="text-primary text-large">
                                Welcome to {appName}, a first of its kind
                                easy to use, secure and super fast money
                                transfer platform.
                            </div>
                            <div className="text-primary text-normal p-b p-t">
                                Your account will let you
                                send money to anyone in the World, just as if
                                it was an email, with fixed fractional fees
                                regardless of the amount and at unprecedented
                                transfer speed.
                            </div>
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel
                            style={styles.stepLabel}
                            icon={<i className="material-icons">perm_identity</i>}
                        >
                            Choose email and password.
                        </StepLabel>
                        <StepContent
                            style={{
                                borderLeft: "1px solid rgba(15,46,83,0.2)",
                            }}
                        >
                            <div>
                                <div>
                                    <InputField
                                        name="signup-email"
                                        type="email"
                                        placeholder="Email"
                                        underlineStyle={styles.underlineStyle}
                                        underlineFocusStyle={
                                            styles.underlineFocusStyle
                                        }
                                        floatingLabelStyle={
                                            styles.floatingLabelStyle
                                        }
                                        floatingLabelFocusStyle={
                                            styles.floatingLabelFocusStyle
                                        }
                                        inputStyle={styles.inputStyle}
                                        validator={
                                            this.emailValidator.bind(this)
                                        }
                                        action={
                                            this.compoundValidate.bind(this)
                                        }
                                        ref={(self) => {
                                            this.textInputFieldEmail = self
                                        }}
                                    />
                                </div>
                                <div>
                                    <InputField
                                        name="signup-password"
                                        type="password"
                                        placeholder="Password"
                                        underlineStyle={styles.underlineStyle}
                                        underlineFocusStyle={
                                            styles.underlineFocusStyle
                                        }
                                        floatingLabelStyle={
                                            styles.floatingLabelStyle
                                        }
                                        floatingLabelFocusStyle={
                                            styles.floatingLabelFocusStyle
                                        }
                                        inputStyle={styles.inputStyle}
                                        validator={this.passwordValidator.bind(this)}
                                        action={this.compoundValidate.bind(this)}
                                        ref={(self) => { this.textInputFieldPassword = self }}
                                    />
                                </div>
                                <div>
                                    <InputField
                                        name="signup-password-confirmation"
                                        type="password"
                                        placeholder="Password Confirmation"
                                        underlineStyle={styles.underlineStyle}
                                        underlineFocusStyle={
                                            styles.underlineFocusStyle
                                        }
                                        floatingLabelStyle={
                                            styles.floatingLabelStyle
                                        }
                                        floatingLabelFocusStyle={
                                            styles.floatingLabelFocusStyle
                                        }
                                        inputStyle={styles.inputStyle}
                                        validator={this.passwordValidator.bind(this)}
                                        action={this.compoundValidate.bind(this)}
                                        ref={(self) => { this.textInputFieldPasswordConf = self }}
                                    />
                                </div>
                            </div>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel
                            style={styles.stepLabel}
                            icon={<i className="material-icons">fingerprint</i>}
                        >
                            Authenticate with Ledger device.
                        </StepLabel>
                        <StepContent style={{ borderLeft: "none", }}>
                            <div className="p-b"></div>
                            {this.renderStepActions(2)}
                        </StepContent>
                    </Step>

                </Stepper>
                {(finished && this.state.accountCreated) && (
                    <div style={{
                        fontSize: "1rem",
                        margin: "20px 0",
                        textAlign: "center",
                    }}>
                        <i className="material-icons">done_all</i>
                        Your account has been setup. Go ahead, check it out!
                    </div>
                )}
                {(finished && !this.state.accountCreated) && (
                    <div
                        className="outline-error"
                        style={{
                            color: "#D32F2F",
                            fontSize: "1rem",
                            margin: "20px 0",
                            textAlign: "center",
                        }}
                    >
                        <i className="material-icons">error</i>
                        There was a problem setting up your account.
                        <div className="small">
                            Reason: {this.state.progressError}
                        </div>
                    </div>
                )}
            </div>
        )
    }

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        appAuth: state.appAuth,
    }),

    // match dispatch to props.
    (dispatch) => bindActionCreators({
        accountExistsOnLedger,
        accountMissingOnLedger,
        logIn,
        setAccountRegistered,
        setAccountPath,
        setLedgerSoftwareVersion,
        setPublicKey,
        changeLoginState,
    }, dispatch)
)(NewAccount)
