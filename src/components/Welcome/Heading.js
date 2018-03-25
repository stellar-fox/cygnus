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
import Signup from "../Account/Signup"
import "./Heading.css"




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
    enableLogin = (loginObj) => {
        this.setState({
            loginButtonDisabled: false,
            loginObj,
        })
        //TODO: handle loginObj to set redux state
    }



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
                <Signup onComplete={this.enableLogin} />
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
