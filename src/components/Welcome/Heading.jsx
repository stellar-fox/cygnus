import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { TopBarSecurityMessage } from "../StellarFox/env"
import {
    AccountBalance,
    AlarmOn,
    Email,
    Fingerprint,
    Language,
    LocationOff,
    PermContactCalendar,
    Replay,
    SettingsEthernet,
} from "@material-ui/icons"
import Button from "../../lib/mui-v1/Button"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"
import { action as AccountAction } from "../../redux/Account"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as ModalAction } from "../../redux/Modal"
import { getExchangeRate } from "../../thunks/assets"
import { nativeToAsset } from "../../logic/assets"
import { baseReserve } from "../StellarFox/env"




// <Heading> component
class Heading extends Component {

    // ...
    state = {
        loginButtonDisabled: true,
        loginObj: null,
    }


    // ...
    componentDidMount = () => this.props.getExchangeRate("usd")
    

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
        this.props.setState({ needsRegistration: false })
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
                                <AlarmOn className="heading-svg-icon" />
                                Transaction settlement in seconds.
                            </div>
                            <div className="col-item">
                                <LocationOff className="heading-svg-icon" />
                                Location independent.
                            </div>
                            <div className="col-item">
                                <Language className="heading-svg-icon" />
                                Global, permissionless transacting.
                            </div>
                        </div>
                        <div className="column">
                            <div className="col-header">
                                Easy and Secure Transactions
                            </div>
                            <div className="col-item">
                                <Fingerprint className="heading-svg-icon" />
                                Security by design.
                            </div>
                            <div className="col-item">
                                <PermContactCalendar className="heading-svg-icon" />
                                Pay to address book contacts.
                            </div>
                            <div className="col-item">
                                <Email className="heading-svg-icon" />
                                Use email as payment address.
                            </div>
                        </div>
                        <div className="column">
                            <div className="col-header">
                                Fractional Cost
                            </div>
                            <div className="col-item">
                                <AccountBalance className="heading-svg-icon" />
                                Account activation fee USD {this.props.usd}
                            </div>
                            <div className="col-item">
                                <SettingsEthernet className="heading-svg-icon" />
                                Flat transaction fee less than USD 0.01
                            </div>
                            <div className="col-item">
                                <Replay className="heading-svg-icon" />
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
        Modal: state.Modal,
        usd: nativeToAsset(
            parseFloat(baseReserve) * 2, state.ExchangeRates.usd.rate
        ),
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        getExchangeRate,
        setState: AccountAction.setState,
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
        showModal: ModalAction.showModal,
        hideModal: ModalAction.hideModal,
    }, dispatch)
)(Heading)
