import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withLoginManager } from "../LoginManager"
import { Redirect } from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    ensureTrailingSlash,
    resolvePath,
    withDynamicRoutes,
    withStaticRouter,
} from "../StellarRouter"
import { Null } from "../../lib/utils"

import {
    hideAlert,
    changeModalState,
    setAccountRegistered,
    ActionConstants,
    changeLoginState,
} from "../../redux/actions"
import { action as AccountAction } from "../../redux/Account"

import {
    Tab,
    Tabs,
} from "material-ui/Tabs"
import Dialog from "material-ui/Dialog"
import Button from "../../lib/common/Button"
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
    static propTypes = {
        match: PropTypes.object.isRequired,
        staticRouter: PropTypes.object.isRequired,
    }


    // ...
    state = { modalButtonText: "CANCEL", }


    // ...
    constructor (props) {
        super(props)

        // relative resolve
        this.rr = resolvePath(this.props.match.path)

        // ...
        this.validTabNames = ["Profile", "Settings", "Security", ]

        // static paths
        this.props.staticRouter.addPaths(
            this.validTabNames.reduce((acc, tn) => ({
                ...acc,
                [tn]: this.rr(ensureTrailingSlash(tn.toLowerCase())),
            }), {})
        )
    }


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
    handleTabSelect = (value) => {
        this.props.setState({ tabSelected: value, })
        this.props.staticRouter.pushByView(value)
    }


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
    render = () => (
        ({
            modal, appUi, appAuth,
            loginManager, currentView,
            staticRouter, state,
        }) =>
            <Fragment>
                <Switch>
                    <Redirect exact
                        from={this.rr(".")}
                        to={staticRouter.getPath(state.tabSelected)}
                    />
                </Switch>

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
                    open={modal.isShowing}
                    onRequestClose={this.handleClose}
                    paperClassName="modal-body"
                    titleClassName="modal-title"
                >
                    Pardon the mess. We are working hard to bring you this
                    feature very soon. Please check back in a while as the
                    feature implementation is being continuously deployed.
                </Dialog>
                <Modal
                    open={appUi.modals.signup ?
                        appUi.modals.signup.showing : false}
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
                        publicKey: appAuth.publicKey,
                        bip32Path: appAuth.bip32Path,
                    }} />
                </Modal>

                <Tabs
                    tabItemContainerStyle={styles.container}
                    inkBarStyle={styles.inkBar}
                    value={
                        this.validTabNames.indexOf(currentView) !== -1 ?
                            currentView : state.tabSelected
                    }
                    onChange={this.handleTabSelect}
                    className="tabs-container"
                >
                    {
                        loginManager.isAuthenticated() ?
                            <Tab
                                style={styles.tab}
                                label={this.validTabNames[0]}
                                value={this.validTabNames[0]}
                            >
                                <Profile />
                            </Tab> :
                            <Null />
                    }
                    <Tab
                        style={styles.tab}
                        label={this.validTabNames[1]}
                        value={this.validTabNames[1]}
                    >
                        <Settings />
                    </Tab>
                    {
                        loginManager.isAuthenticated() ?
                            <Tab
                                style={styles.tab}
                                label={this.validTabNames[2]}
                                value={this.validTabNames[2]}
                            >
                                <Security />
                            </Tab> :
                            <Null />
                    }
                </Tabs>
            </Fragment>
    )(this.props)

}


// ...
export default compose(
    withLoginManager,
    withStaticRouter,
    withDynamicRoutes,
    connect(
        // map state to props.
        (state) => ({
            state: state.Account,
            modal: state.modal,
            appAuth: state.appAuth,
            appUi: state.appUi,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            hideAlert,
            changeModalState,
            setAccountRegistered,
            changeLoginState,
        }, dispatch)
    )
)(Account)
