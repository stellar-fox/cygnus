import React, { Component } from "react"
import { connect } from "react-redux"
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from "material-ui/Stepper"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import { emailValid, passwordValid, passwordsMatch } from "../../lib/utils"
import TextInputField from "../TextInputField"


class NewAccount extends Component {
    
    // ...
    constructor (props) {
        super(props)
        this.state = {
            finished: false,
            stepIndex: 0,
            email: "",
            password: "",
        }
    }


    // ...
    handleNext () {
        const { stepIndex, } = this.state

        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 1,
        })

        if (stepIndex >= 1) {
            this.props.onComplete("DONE")
        }
    }


    // ...
    handlePrev () {
        const { stepIndex, } = this.state
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1, })
        }
    }


    // ...
    createAccount () {
        console.log("creating an account with path: ", this.props.accountInfo.accountPath) // eslint-disable-line no-console
        this.handleNext.call(this)
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
                        onClick={this.compoundValidate.bind(this)}
                        style={{ marginRight: 12, }}
                    />
                )}
                {step === 1 && (
                    <div>
                        <div className="emphasize-light-success">
                            {this.state.email}
                        </div>
                        <div className="small">
                            will be associated with account {this.props.accountInfo.accountPath} on your Ledger device.
                        </div>
                        <div className="p-t"></div>
                        <RaisedButton
                            label="Register"
                            disableTouchRipple={true}
                            disableFocusRipple={true}
                            backgroundColor="rgb(15,46,83)"
                            labelColor="rgb(244,176,4)"
                            onClick={this.createAccount.bind(this)}
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
                    </div>
                )}

            </div>
        )
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

        if (!passwordsMatch(this.textInputFieldPassword.state.value, this.textInputFieldPasswordConf.state.value)) {
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
            <div style={{ maxWidth: 580, maxHeight: 580, margin: "auto", }}>
                <Stepper connector={null} activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">person</i>}>
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
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">verified_user</i>}>
                            Verify Data
                        </StepLabel>
                        <StepContent style={{ borderLeft: "none", }}>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">account_box</i>}>
                            Your Account
                        </StepLabel>
                        <StepContent style={{ borderLeft: "none", }}>
                            {this.renderStepActions(2)}
                        </StepContent>
                    </Step>
                </Stepper>
                {finished && (
                    <p style={{ margin: "20px 0", textAlign: "center", }}>
                        Your account has been setup. (simulation)
                    </p>
                )}
            </div>
        )
    }
}


// ...
function mapStateToProps (state) {
    return {
        accountInfo: state.accountInfo,
    }
}


export default connect(mapStateToProps)(NewAccount)