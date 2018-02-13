import React, {Component} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from "material-ui/Stepper"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import TextField from "material-ui/TextField"
import {emailValid, passwordValid} from "../../lib/utils"
import {
    disableAuthenticateButton,
    enableAuthenticateButton,
} from "../../actions/index"

import { LedgerAuthenticator } from "../LedgerAuthenticator"

class CreateAccountStepper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            finished: false,
            stepIndex: 0,
            email: "",
            password: "",
            passwordConf: "",
            emailError: null,
            passwordError: null,
            passwordConfError: null,
        }
    }

    handleNext(event) {
        const { stepIndex } = this.state
        let proceed = true
        // check email validity and password/pass-conf pair
        if (stepIndex === 0) {
            if(!emailValid(this.state.email)) {
                this.setState({
                    emailError: "invalid email address"
                })
                proceed = false
            } else {
                this.setState({
                    emailError: null
                })
            }

            if(!passwordValid(this.state.password)) {
                this.setState({
                    passwordError: "invalid password"
                })
                proceed = false
            } else {
                this.setState({
                    passwordError: null
                })
            }

            if (this.state.password !== this.state.passwordConf) {
                this.setState({
                    passwordConfError: "password mismatch"
                })
                proceed = false
            } else {
                this.setState({
                    passwordConfError: null
                })
            }
        }

        if (stepIndex === 1) {
            event.persist()
            if (event.target.textContent === "AUTHENTICATE") {
                console.log("create account via ledger... but not here") // eslint-disable-line no-console
            } else {
                console.log("opt out") // eslint-disable-line no-console
            }
        }

        if (proceed) {
            this.setState({
                stepIndex: stepIndex + 1,
                finished: stepIndex >= 1,
            })
        }

        if(stepIndex >= 1) {
            this.props.onComplete("DONE")
        }
    }

    handlePrev() {
        const { stepIndex } = this.state
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 })
        }
    }

    createAccount(bip32Path) {
        console.log("creating an account with path: ", bip32Path) // eslint-disable-line no-console
    }

    renderStepActions(step) {
        const { stepIndex } = this.state

        return (
            <div style={{ margin: "12px 0" }}>

                {step === 0 && (
                    <RaisedButton
                        label="Next"
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        backgroundColor="rgb(15,46,83)"
                        labelColor="rgb(244,176,4)"
                        onClick={this.handleNext.bind(this)}
                        style={{ marginRight: 12 }}
                    />
                )}
                
                {step === 1 && (
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
                            labelStyle={{ color: "rgb(244,176,4)" }}
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
                            labelStyle={{ color: "rgb(15,46,83)" }}
                            onClick={this.handlePrev.bind(this)}
                        />
                    </div>
                )}
            </div>
        )
    }

    updateEmail(event) {
        this.setState({
            email: event.target.value
        })
    }

    updatePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    updatePasswordConf(event) {
        this.setState({
            passwordConf: event.target.value
        })
    }

    handleOptOut() {
        console.log("out out") // eslint-disable-line no-console
    }

    render() {
        const { finished, stepIndex } = this.state
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
            <div style={{ maxWidth: 580, maxHeight: 580, margin: "auto" }}>
                <Stepper connector={null} activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">perm_identity</i>}>
                            Choose email and password.
                        </StepLabel>
                        <StepContent style={{borderLeft: "1px solid rgba(15,46,83,0.2)"}}>
                            <div>
                                <TextField
                                    type="email"
                                    floatingLabelText="Email"
                                    errorText={this.state.emailError}
                                    errorStyle={styles.errorStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    inputStyle={styles.inputStyle}
                                    onChange={this.updateEmail.bind(this)}
                                    value={this.state.email}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            this.handleNext.call(this)
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    type="password"
                                    floatingLabelText="Password"
                                    errorText={this.state.passwordError}
                                    errorStyle={styles.errorStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    inputStyle={styles.inputStyle}
                                    onChange={this.updatePassword.bind(this)}
                                    value={this.state.password}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            this.handleNext.call(this)
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <TextField
                                    type="password"
                                    floatingLabelText="Confirm Password"
                                    errorText={this.state.passwordConfError}
                                    errorStyle={styles.errorStyle}
                                    underlineStyle={styles.underlineStyle}
                                    underlineFocusStyle={styles.underlineStyle}
                                    floatingLabelStyle={styles.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                                    inputStyle={styles.inputStyle}
                                    onChange={this.updatePasswordConf.bind(this)}
                                    value={this.state.passwordConf}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            this.handleNext.call(this)
                                        }
                                    }}
                                />
                            </div>
                            {this.renderStepActions(0)}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} icon={<i className="material-icons">fingerprint</i>}>
                            Authenticate with Ledger device.
                        </StepLabel>
                        <StepContent style={{borderLeft: "none"}}>
                            <div className="p-b"></div>
                            {this.renderStepActions(1)}
                        </StepContent>
                    </Step>
                </Stepper>
                {finished && (
                    <p style={{ margin: "20px 0", textAlign: "center" }}>
                        Your account has been setup. (simulation)
                    </p>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        ui: state.ui,
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        disableAuthenticateButton,
        enableAuthenticateButton,
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(CreateAccountStepper)