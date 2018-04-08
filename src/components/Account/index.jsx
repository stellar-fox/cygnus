import React, { Component, Fragment } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withLoginManager } from "../LoginManager"
import {
    hideAlert,
    setTab,
    changeModalState,
    changeSnackbarState,
    setAccountRegistered,
    ActionConstants,
    changeLoginState,
} from "../../redux/actions"
import { action as AccountAction } from "../../redux/Account"
import { Tabs, Tab } from "material-ui/Tabs"
import Dialog from "material-ui/Dialog"
import Button from "../../lib/common/Button"
import Snackbar from "../../lib/common/Snackbar"
import Modal from "../../lib/common/Modal"
import Signup from "../Account/Signup"
import Profile from "./Profile"
import Settings from "./Settings"
import Security from "./Security"
import "./index.css"




// ...
const styles = {
    tab: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
        color: "rgba(244,176,4,0.9)",
    },
    inkBar: {
        backgroundColor: "rgba(244,176,4,0.8)",
    },
    container: {
        backgroundColor: "#2e5077",
        borderRadius: "3px",
    },
}




// <Account> component
class Account extends Component {

    // ...
    state = {
        modalButtonText: "CANCEL",
    }


    // ...
    closeSnackBar = () =>
        this.props.changeSnackbarState({
            open: false,
            message: "",
        })


    // ...
    completeRegistration = (loginObj) => {
        this.changeButtonText()
        this.props.setAccountRegistered(true)
        this.props.changeLoginState({
            loginState: ActionConstants.LOGGED_IN,
            publicKey: this.props.appAuth.publicKey,
            bip32Path: this.props.appAuth.bip32Path,
            userId: loginObj.userId,
            token: loginObj.token,
        })
    }


    // ...
    handleTabChange = (_, value) => this.props.setTab({ accounts: value, })


    // ...
    handleClose = () => this.props.hideAlert()


    // ...
    changeButtonText = () => this.setState({ modalButtonText: "DONE", })


    // ...
    hideSignupModal = () =>
        this.props.changeModalState({
            signup: {
                showing: false,
            },
        })


    // ...
    render = () =>
        <Fragment>
            <Dialog
                title="Not Yet Implemented"
                actions={[
                    <Button
                        label="OK"
                        keyboardFocused={true}
                        onClick={this.handleClose}
                    />,
                ]}
                modal={false}
                open={this.props.modal.isShowing}
                onRequestClose={this.handleClose}
                paperClassName="modal-body"
                titleClassName="modal-title"
            >
                Pardon the mess. We are working hard to bring you this
                feature very soon. Please check back in a while as the
                feature implementation is being continuously deployed.
            </Dialog>
            <Modal
                open={this.props.appUi.modals.signup ?
                    this.props.appUi.modals.signup.showing : false}
                title="Opening Your Bank - Register Account"
                actions={[
                    <Button
                        label={this.state.modalButtonText}
                        onClick={this.hideSignupModal}
                        primary={true}
                    />,
                ]}
            >
                <Signup onComplete={this.completeRegistration} config={{
                    useAsRegistrationForm: true,
                    publicKey: this.props.appAuth.publicKey,
                    bip32Path: this.props.appAuth.bip32Path,
                }} />
            </Modal>

            <Snackbar
                open={this.props.appUi.snackbar.open}
                message={this.props.appUi.snackbar.message}
                onRequestClose={this.closeSnackBar}
            />

            <Tabs
                tabItemContainerStyle={styles.container}
                inkBarStyle={styles.inkBar}
                value={this.props.ui.tabs.accounts}
                onChange={this.handleTabChange.bind(this, this.value)}
                className="tabs-container"
            >
                {this.props.loginManager.isAuthenticated() ? (
                    <Tab style={styles.tab} label="Profile" value="1">
                        <Profile />
                    </Tab>
                ) : null}
                <Tab style={styles.tab} label="Settings" value="2">
                    <Settings />
                </Tab>
                {this.props.loginManager.isAuthenticated() ? (
                    <Tab style={styles.tab} label="Security" value="3">
                        <Security />
                    </Tab>
                ) : null}
            </Tabs>
        </Fragment>

}


// ...
export default compose(
    withLoginManager,
    connect(
        // map state to props.
        (state) => ({
            state: state.Account,
            modal: state.modal,
            ui: state.ui,
            appAuth: state.appAuth,
            appUi: state.appUi,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            hideAlert,
            setTab,
            changeModalState,
            changeSnackbarState,
            setAccountRegistered,
            changeLoginState,
        }, dispatch)
    )
)(Account)
