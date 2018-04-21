import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { TopBarSecurityMessage } from "../StellarFox/env"

import {
    changeModalState,
} from "../../redux/actions"

import Button from "../../lib/common/Button"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"

import { action as AccountAction } from "../../redux/Account"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"




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
            signup: {
                showing: true,
            },
        })


    // ...
    hideSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: false,
            },
        })


    // ...
    enableLogin = (loginObj) => {
        this.setState({
            loginButtonDisabled: false,
            loginObj,
        })
    }


    // ...
    login = () => {
        this.hideSignupModal()
        this.props.setState({ needsRegistration: false, })
        this.props.setLedgerBip32Path(this.state.loginObj.bip32Path)
        this.props.setLedgerPublicKey(this.state.loginObj.publicKey)
        this.props.setApiToken(this.state.loginObj.token)
        this.props.setUserId(this.state.loginObj.userId) 
    }


    // ...
    cancelLogin = () => {
        this.hideSignupModal()
    }


    // ...
    render = () =>
        <Fragment>
            <Modal
                open={
                    this.props.appUi.modals.signup ?
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
        setState: AccountAction.setState,
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
        changeModalState,
    }, dispatch)
)(Heading)
