import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { TopBarSecurityMessage } from "../StellarFox/env"
import { Typography } from "@material-ui/core"
import Button from "../../lib/mui-v1/Button"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"
import { action as AccountAction } from "../../redux/Account"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as ModalAction } from "../../redux/Modal"
import { getExchangeRate } from "../../thunks/assets"
import BottomHeadingContent from "./BottomHeadingContent"
import TopHeadingContent from "./TopHeadingContent"




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
                <TopHeadingContent />

                <div className="m-t-large hero">
                    <Typography variant="h1" color="secondary">
                        Welcome to Cygnus.
                    </Typography>
                    <div className="title">
                        Join the financial inclusion.
                    </div>
                    <div className="subtitle">
                        Open your <b>own</b> bank today and
                        reserve secure and personalized payment address.
                    </div>
                </div>

                <div className="flex-row-centered">
                    <Button
                        color="awesome"
                        onClick={this.showSignupModal}
                    >
                        Open Free Account
                    </Button>
                </div>

                <div className="container m-t-large m-b">
                    <BottomHeadingContent />
                </div>
            </div>
        </Fragment>
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        Modal: state.Modal,
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
