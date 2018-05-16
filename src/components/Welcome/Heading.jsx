import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { TopBarSecurityMessage } from "../StellarFox/env"

import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import AlarmOnIcon from "@material-ui/icons/AlarmOn"
import EmailIcon from "@material-ui/icons/Email"
import FingerprintIcon from "@material-ui/icons/Fingerprint"
import LanguageIcon from "@material-ui/icons/Language"
import LocationOffIcon from "@material-ui/icons/LocationOff"
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar"
import ReplayIcon from "@material-ui/icons/Replay"
import SettingsEthernetIcon from "@material-ui/icons/SettingsEthernet"

import Button from "../../lib/mui-v1/Button"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"

import { action as AccountAction } from "../../redux/Account"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as ModalAction } from "../../redux/Modal"




// <Heading> component
class Heading extends Component {

    // ...
    state = {
        loginButtonDisabled: true,
        loginObj: null,
    }


    // ...
    showSignupModal = () => {
        this.props.showModal("signup")
    }


    // ...
    enableLogin = (loginObj) =>
        this.setState({
            loginButtonDisabled: false,
            loginObj,
        })


    // ...
    login = () => {
        this.props.hideModal()
        this.props.setState({ needsRegistration: false, })
        this.props.setLedgerBip32Path(this.state.loginObj.bip32Path)
        this.props.setLedgerPublicKey(this.state.loginObj.publicKey)
        this.props.setApiToken(this.state.loginObj.token)
        this.props.setUserId(this.state.loginObj.userId)
    }


    // ...
    render = () =>
        <Fragment>
            <Modal
                open={
                    this.props.Modal.modalId === "signup" &&
                    this.props.Modal.visible
                }
                title="Opening Your Bank"
                actions={[
                    <Button
                        onClick={this.login}
                        disabled={this.state.loginButtonDisabled}
                        color="primary"
                    >
                        Login
                    </Button>,
                    <Button
                        onClick={this.props.hideModal}
                        color="primary"
                    >
                        Cancel
                    </Button>,
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
                        Open your <b>own lifetime bank</b> today and
                        reserve personalized payment address.
                    </div>
                </div>

                <div className="flex-row-centered">
                    <Button
                        color="awesome"
                        onClick={this.showSignupModal}
                    >
                        Get Started
                    </Button>
                </div>

                <div className="container">
                    <div className="columns">
                        <div className="column">
                            <div className="col-header">True Freedom</div>
                            <div className="col-item">
                                <AlarmOnIcon className="heading-svg-icon" />
                                Transaction settlement in seconds.
                            </div>
                            <div className="col-item">
                                <LocationOffIcon className="heading-svg-icon" />
                                Location independent.
                            </div>
                            <div className="col-item">
                                <LanguageIcon className="heading-svg-icon" />
                                Global, permissionless transacting.
                            </div>
                        </div>
                        <div className="column">
                            <div className="col-header">
                                Easy and Secure Transactions
                            </div>
                            <div className="col-item">
                                <FingerprintIcon className="heading-svg-icon" />
                                Security by design.
                            </div>
                            <div className="col-item">
                                <PermContactCalendarIcon className="heading-svg-icon" />
                                Pay to address book contacts.
                            </div>
                            <div className="col-item">
                                <EmailIcon className="heading-svg-icon" />
                                Use email as payment address.
                            </div>
                        </div>
                        <div className="column">
                            <div className="col-header">
                                Fractional Cost
                            </div>
                            <div className="col-item">
                                <AccountBalanceIcon className="heading-svg-icon" />
                                Account activation fee 0.50$.
                            </div>
                            <div className="col-item">
                                <SettingsEthernetIcon className="heading-svg-icon" />
                                End-to-end transfer fee 0.99$.
                            </div>
                            <div className="col-item">
                                <ReplayIcon className="heading-svg-icon" />
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
    (state) => ({ Modal: state.Modal, }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setState: AccountAction.setState,
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
        showModal: ModalAction.showModal,
        hideModal: ModalAction.hideModal,
    }, dispatch)
)(Heading)
