import React, { Component } from "react"
import {
    Stepper,
    Step,
    StepLabel,
    StepContent
} from "material-ui/Stepper"
import LedgerAuthenticator from "../LedgerAuthenticator"
import InputField from "../../frontend/InputField"
import Button from "../../frontend/Button"

const styles = {
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


// <Signup> component
export default class Signup extends Component {

    // ...
    state = {
        stepIndex: 0,
        message: "...",
    }


    // ...
    handleButtonAction = (action) => {
        const { stepIndex, } = this.state
        this.setState({
            stepIndex: action === "next" ?
                (stepIndex + 1) : (stepIndex - 1),
        })

    }


    // ...
    createAccount = async (ledgerData) => {
        this.setState({
            message: "Your has been created.",
        })
        //TODO: construct login obj here include token.
        this.props.onComplete.call(this, ledgerData)
    }


    // ...
    render = () => <Stepper
        connector={null}
        orientation="vertical"
        activeStep={this.state.stepIndex}>
        <Step>
            <StepLabel style={{
                fontSize: "1rem",
            }}
            icon={<i className="material-icons">person</i>}
            iconContainerStyle={{
                transform: "scale(1.4)",
                marginRight: "-10px",
            }}>Set account access credentials.</StepLabel>
            <StepContent style={{
                borderLeft: "1px solid rgba(15,46,83,0.25)",
                fontSize: "1rem",
                color: "rgba(15,46,83,1)",
                marginLeft: "20px",
                marginBottom: "8px",
            }}>
                <div className="f-b">
                    <div className="f-b-col">
                        <InputField
                            name="register-email"
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
                            validator={this.emailValidator}
                            action={this.compoundValidate}
                            ref={(self) => { this.textInputFieldEmail = self }}
                        />
                        <InputField
                            name="register-password"
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
                            validator={this.passwordValidator}
                            action={this.compoundValidate}
                            ref={(self) => { this.textInputFieldPassword = self }}
                        />
                        <InputField
                            name="register-password-confirmation"
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
                            validator={this.passwordValidator}
                            action={this.compoundValidate}
                            ref={(self) => { this.textInputFieldPasswordConf = self }}
                            style={{ marginBottom: "15px", }}
                        />
                        <Button
                            label="Next"
                            primary={true}
                            onClick={this.handleButtonAction.bind(this, "next")}
                        />
                    </div>
                </div>
            </StepContent>
        </Step>

        <Step>
            <StepLabel style={{
                fontSize: "1rem",
            }}
            icon={<i className="material-icons">verified_user</i>}
            iconContainerStyle={{
                transform: "scale(1.4)",
                marginRight: "-10px",
            }}>Authenticate with Ledger.</StepLabel>
            <StepContent style={{
                fontSize: "1rem",
                color: "rgba(15,46,83,1)",
            }}>
                <div className="f-b">
                    <div className="f-b-col">
                        <LedgerAuthenticator
                            style={{
                                marginBottom: "10px",
                            }}
                            className="dark"
                            onConnected={this.createAccount}
                            onClick={null}
                        />
                    </div>
                </div>
                <div className="p-t">
                    {this.state.message}
                </div>
            </StepContent>
        </Step>
    </Stepper>
}
