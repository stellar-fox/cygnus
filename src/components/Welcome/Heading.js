import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { TopBarSecurityMessage } from "../../env"

import {
    ActionConstants,
    changeLoginState,
    changeModalState
} from "../../actions"

import Button from "../../frontend/Button"
import Modal from "../../frontend/Modal"
import InputField from "../../frontend/InputField"
// import CreateAccount from "../Account/Create"
import {
    Stepper,
    Step,
    StepLabel,
    StepContent
} from "material-ui/Stepper"
import LedgerAuthenticator from "../LedgerAuthenticator"
// import Step from "../../frontend/Step"

import "./Heading.css"

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


// <Heading> component
class Heading extends Component {

    // ...
    state = {
        loginButtonDisabled: true,
        loginObj: null,
    }


    // ...
    showSignupModal = () =>
        this.props.changeModalState({
            modals: {
                signup: {
                    showing: true,
                },
            },
        })


    // ...
    hideSignupModal = () =>
        this.props.changeModalState({
            modals: {
                signup: {
                    showing: false,
                },
            },
        })


    // ...
    enableLogin = (loginObj) =>
        this.setState({
            loginButtonDisabled: false,
            loginObj,
        })


    // ...
    login = () => {
        this.hideSignupModal()
        this.props.changeLoginState(this.state.loginObj)
    }


    // ...
    cancelLogin = () => {
        this.props.changeLoginState({
            loginState: ActionConstants.LOGGED_OUT,
            publicKey: null,
            bip32Path: null,
            userId: null,
            token: null,
        })
        this.hideSignupModal()
    }


    // ...
    render = () =>
        <Fragment>
            <Modal
                open={
                    typeof this.props.appUi.modals !== "undefined" &&
                    typeof this.props.appUi.modals.signup !== "undefined" ?
                        this.props.appUi.modals.signup.showing : false
                }
                title="Opening Your Bank"
                actions={[
                    <Button
                        label="Login"
                        onClick={this.login}
                        primary={true}
                        disabled={this.state.loginButtonDisabled}
                    />,
                    <Button
                        label="Cancel"
                        onClick={this.cancelLogin}
                        primary={true}
                    />,
                ]}
            >

                <Stepper
                    connector={null}
                    orientation="vertical"
                    activeStep={0}>
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
                                        style={{marginBottom: "15px",}}
                                    />
                                    <Button
                                        label="Next"
                                        primary={true}
                                        onClick={null}
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
                                        className="dark"
                                        onConnected={null}
                                        onClick={null}
                                    />
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>

                {/* <Stepper
                    orientation="vertical"
                    activeStep={0}
                    connector={<i className="material-icons">person</i>}
                    children={
                        <Fragment>
                            <Step
                                active={true}
                                icon="person"
                                label="Your Account Credentials"
                                content={<Fragment>
                                    Please provide email and password
                                    in order to access your account.
                                </Fragment>}
                            />
                            <Step
                                active={false}
                                icon="person"
                                label="Hello ma bratha!"
                                content={<Fragment>
                                    Hello my friend!
                                </Fragment>}
                            />
                        </Fragment>
                    }
                /> */}



                {/* <CreateAccount
                    onComplete={this.enableLogin}
                /> */}
            </Modal>

            <TopBarSecurityMessage />
            <div className="faded-image cash">
                <div className="hero">
                    <div className="title">
                        Welcome to the money revolution.
                    </div>
                    <div className="subtitle">
                        Open your own <b>lifetime bank</b> today and
                        reserve personalized payment address.
                    </div>
                </div>

                <div className="flex-row-centered">
                    <Button
                        onClick={this.showSignupModal}
                        label="Get Started"
                        secondary={true}
                    />
                </div>
                <div className="container">
                    <div className="columns">
                        <div className="column">
                            <div className="col-header">True Freedom</div>
                            <div className="col-item">
                                <i className="material-icons">alarm_on</i>
                                Transaction settlement in seconds.
                            </div>
                            <div className="col-item">
                                <i className="material-icons">
                                    location_off
                                </i>
                                Location independent.
                            </div>
                            <div className="col-item">
                                <i className="material-icons">language</i>
                                Global, permissionless transacting.
                            </div>
                        </div>
                        <div className="column">
                            <div className="col-header">
                                Easy, Secure Transactions
                            </div>
                            <div className="col-item">
                                <i className="material-icons">
                                    fingerprint
                                </i>
                                Security by design.
                            </div>
                            <div className="col-item">
                                <i className="material-icons">
                                    perm_contact_calendar
                                </i>
                                Pay to address book contacts.
                            </div>
                            <div className="col-item">
                                <i className="material-icons">email</i>
                                Use email as payment address.
                            </div>
                        </div>
                        <div className="column">
                            <div className="col-header">
                                Fractional Cost
                            </div>
                            <div className="col-item">
                                <i className="material-icons">
                                    account_balance
                                </i>
                                Account activation fee 0.50$.
                            </div>
                            <div className="col-item">
                                <i className="material-icons">
                                    settings_ethernet
                                </i>
                                End-to-end transfer fee 0.99$.
                            </div>
                            <div className="col-item">
                                <i className="material-icons">replay</i>
                                Free recurring payments.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        appUi: state.appUi,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
        changeModalState,
    }, dispatch)
)(Heading)
