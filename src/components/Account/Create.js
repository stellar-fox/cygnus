import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from "material-ui/Stepper"
import LinearProgress from "material-ui/LinearProgress"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import {
    emailValid,
    passwordValid,
    extractPathIndex,
} from "../../lib/utils"
import LedgerAuthenticator from "../LedgerAuthenticator"
import TextInputField from "../TextInputField"
import axios from "axios"
import { config } from "../../config"
import {
    accountExistsOnLedger,
    accountMissingOnLedger,
    logInToHorizon,
    selectView,
    setAccountRegistered,
    setAccountPath,
    setLedgerSoftwareVersion,
    setPublicKey,
} from "../../actions/index"

class NewAccount extends Component {

    // ...
    constructor (props) {
        super(props)
        this.state = {
            finished: false,
            stepIndex: 0,
            email: "",
            password: "",
            accountCreated: false,
            progressCompleted: 0,
            progressText: "",
            progressError: "",
        }
    }


    // ...
    handleNext () {
        const { stepIndex, } = this.state

        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        })

        if (stepIndex >= 2) {
            this.props.onComplete("LOGIN")
        }
    }


    // ...
    handlePrev () {
        const { stepIndex, } = this.state
        if (stepIndex > 0) {
            this.setState({
                stepIndex: stepIndex - 1,
            })
        }
    }


    // ...
    progress (completed) {
        if (completed > 100) {
            this.setState({
                completed: 100,
            })
        } else {
            this.setState({completed,})
        }
    }


    // ...
    async createAccount (ledgerData) {

        await new Promise((res, _) => {
            this.setState({
                completed: 33,
                progressText: "Creating user ...",
            })
            setTimeout(res, 500)
        })

        const userId = await axios
            .post(
                `${config.api}/user/create/${this.state.email}/${this.state.password}`
            )
            .then((response) => {
                return response.data.id
            })
            .catch((error) => {
                this.setState({
                    progressError: error.message,
                })
                console.log(error) // eslint-disable-line no-console
                return null
            })

        await new Promise((res, _) => {
            this.setState({
                completed: 66,
                progressText: "Creating account ...",
            })
            setTimeout(res, 500)
        })

        if (userId) {
            const accountId = await axios
                .post(
                    `${config.api}/account/create/${userId}/${ledgerData.publicKey}?path=${extractPathIndex(ledgerData.bip32Path)}`
                )
                .then((response) => {
                    return response.data.account_id
                })
                .catch((error) => {
                    this.setState({
                        progressError: error.message,
                    })
                    console.log(error) // eslint-disable-line no-console
                    return null
                })

            if (accountId) {
                this.setState({
                    accountCreated: true,
                    completed: 100,
                })
            }
        }

        await new Promise((res, _) => {
            this.setState({
                completed: 100,
                progressText: "Completed.",
            })
            setTimeout(res, 500)
        })

        this.handleNext.call(this)

        // LOGIN UPON ACCOUNT CREATION
        this.props.setPublicKey(ledgerData.publicKey)
        this.props.setLedgerSoftwareVersion(ledgerData.softwareVersion)
        this.props.setAccountPath(ledgerData.bip32Path)

    }


    // ...
    renderStepActions (step) {
        const { stepIndex, } = this.state

        return (
            <div style={{ margin: "12px 0", }}>

                {step === 0 && (
                    <RaisedButton
                        label="Next"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        backgroundColor="rgb(15,46,83)"
                        labelColor="rgb(244,176,4)"
                        onClick={this.handleNext.bind(this)}
                        style={{ marginRight: 12, }}
                    />
                )}

                {step === 1 && (
                    <Fragment>
                        <RaisedButton
                            label="Next"
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            backgroundColor="rgb(15,46,83)"
                            labelColor="rgb(244,176,4)"
                            onClick={this.compoundValidate.bind(this)}
                            style={{ marginRight: 12, }}
                        />
                        <FlatButton
                            label="Back"
                            disabled={stepIndex === 0}
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            labelStyle={{ color: "rgb(15,46,83)", }}
                            onClick={this.handlePrev.bind(this)}
                        />
                    </Fragment>
                )}

                {step === 2 && (
                    <div>
                        <div className="dark">

                            <div className="emphasize-light-success">
                                {this.state.email}
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
                        <p className="tiny">
                            If you do
                            not currently own a Ledger device you can
                            still open an account with us by clicking the
                            'OPT OUT' button. Please make sure you
                            understand the security implications before
                            proceeding.
                        </p>
                        <FlatButton
                            label="OPT OUT"
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            onClick={this.handleOptOut.bind(this)}
                            labelStyle={{ color: "rgb(244,176,4)", }}
                            style={{
                                marginRight: 12,
                                backgroundColor: "rgba(84,110,122,0.3)",
                            }}
                        />
                        <FlatButton
                            label="Back"
                            disabled={stepIndex === 0}
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            labelStyle={{ color: "rgb(15,46,83)", }}
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
                    </div>
                )}
            </div>
        )
    }


    // ...
    handleOptOut () {
        console.log("out out") // eslint-disable-line no-console
    }


    // ...
    emailValidator (email) {
        return !emailValid(email) ? "invalid email" : null
    }


    // ...
    passwordValidator (password) {
        return !passwordValid(password) ? "invalid password" : null
    }


    // ...
    compoundValidate () {
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

        if (this.textInputFieldPassword.state.value !== this.textInputFieldPasswordConf.state.value) {
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
    render () {
        const { finished, stepIndex, } = this.state
        const styles = {
            stepLabel: {
                fontSize: "1rem",
            },
            errorStyle: {
                color: "#912d35",
            },
            underlineStyle: {
                borderColor: "rgba(15,46,83,0.6)",
            },
            floatingLabelStyle: {
                color: "rgba(15,46,83,0.5)",
            },
            floatingLabelFocusStyle: {
                color: "rgba(15,46,83,0.35)",
            },
            inputStyle: {
                color: "rgba(15,46,83,0.8)",
            },
        }
        return (
            <div style={{ maxWidth: 480, maxHeight: 480, margin: "auto", }}>
                <Stepper connector={null} activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">perm_identity</i>}>
                            About your account
                        </StepLabel>
                        <StepContent style={{ borderLeft: "1px solid rgba(15,46,83,0.2)", }}>
                            <div className="navy">
                                Welcome to Stellar Fox, a first of its kind
                                easy to use, secure and super fast money
                                transfer platform. Your account will let you
                                send money to anyone in the World, just as if
                                it was an email, with fixed fractional fees
                                regardless of the amount and at unpresedented
                                transfer speed.
                            </div>
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">perm_identity</i>}>
                            Choose email and password.
                        </StepLabel>
                        <StepContent style={{ borderLeft: "1px solid rgba(15,46,83,0.2)", }}>
                            <div>
                                <TextInputField
                                    type="email"
                                    floatingLabelText="Email"
                                    styles={styles}
                                    validator={this.emailValidator.bind(this)}
                                    action={this.compoundValidate.bind(this)}
                                    ref={(self) => { this.textInputFieldEmail = self }}
                                />
                            </div>
                            <div>
                                <TextInputField
                                    type="password"
                                    floatingLabelText="Password"
                                    styles={styles}
                                    validator={this.passwordValidator.bind(this)}
                                    action={this.compoundValidate.bind(this)}
                                    ref={(self) => { this.textInputFieldPassword = self }}
                                />
                            </div>
                            <div>
                                <TextInputField
                                    type="password"
                                    floatingLabelText="Password Confirmation"
                                    styles={styles}
                                    validator={this.passwordValidator.bind(this)}
                                    action={this.compoundValidate.bind(this)}
                                    ref={(self) => { this.textInputFieldPasswordConf = self }}
                                />
                            </div>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">fingerprint</i>}>
                            Authenticate with Ledger device.
                        </StepLabel>
                        <StepContent style={{ borderLeft: "none", }}>
                            <div className="p-b"></div>
                            {this.renderStepActions(2)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">account_box</i>}>
                            Your new account.
                        </StepLabel>
                        <StepContent style={{ borderLeft: "none", }}>
                            {this.renderStepActions(3)}
                        </StepContent>
                    </Step>
                </Stepper>
                {(finished && this.state.accountCreated) && (
                    <div style={{ fontSize: "1rem", margin: "20px 0", textAlign: "center", }}>
                        <i className="material-icons">done_all</i>
                        Your account has been setup. Go ahead, check it out!
                    </div>
                )}
                {(finished && !this.state.accountCreated) && (
                    <div className="outline-error" style={{ color: "#D32F2F", fontSize: "1rem", margin: "20px 0", textAlign: "center", }}>
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

function matchDispatchToProps (dispatch) {
    return bindActionCreators(
        {
            accountExistsOnLedger,
            accountMissingOnLedger,
            logInToHorizon,
            selectView,
            setAccountRegistered,
            setAccountPath,
            setLedgerSoftwareVersion,
            setPublicKey,
        },
        dispatch
    )
}

export default connect(null, matchDispatchToProps)(NewAccount)