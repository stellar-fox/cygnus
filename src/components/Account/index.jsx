import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"
import { withLoginManager } from "../LoginManager"
import {
    Redirect,
    Route,
} from "react-router-dom"
import {
    ConnectedSwitch as Switch,
    ensureTrailingSlash,
    resolvePath,
    withDynamicRoutes,
    withStaticRouter,
} from "../StellarRouter"

import {
    hideAlert,
    changeModalState,
} from "../../redux/actions"
import { action as AccountAction } from "../../redux/Account"
import { action as LoginManagerAction } from "../../redux/LoginManager"

import {
    Tab,
    Tabs,
} from "material-ui/Tabs"
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
    constructor (props) {
        super(props)

        // relative resolve
        this.rr = resolvePath(this.props.match.path)

        // ...
        this.validTabNames = ["Settings", "Profile", "Security", ]

        // static paths
        this.props.staticRouter.addPaths(
            this.validTabNames.reduce((acc, tn) => ({
                ...acc,
                [tn]: this.rr(ensureTrailingSlash(tn.toLowerCase())),
            }), {})
        )
    }


    // ...
    state = { modalButtonText: "CANCEL", }


    // ...
    completeRegistration = (loginObj) => {
        this.changeButtonText()
        this.props.setState({ needsRegistration: false, })
        this.props.setApiToken(loginObj.token)
        this.props.setUserId(loginObj.userId)
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
            appUi, publicKey, bip32Path,
            loginManager, currentView,
            staticRouter: { getPath, }, state,
        }) =>
            <Switch>
                <Redirect exact
                    from={this.rr(".")}
                    to={getPath(state.tabSelected)}
                />
                <Route exact path={getPath(state.tabSelected)}>
                    <Fragment>
                        <Modal
                            open={
                                appUi.modals.signup ?
                                    appUi.modals.signup.showing : false
                            }
                            title="Opening Your Bank - Register Account"
                            actions={[
                                <Button
                                    label={this.state.modalButtonText}
                                    onClick={this.hideSignupModal}
                                    primary={true}
                                />,
                            ]}
                        >
                            <Signup
                                onComplete={this.completeRegistration}
                                config={{
                                    useAsRegistrationForm: true,
                                    publicKey,
                                    bip32Path,
                                }}
                            />
                        </Modal>

                        <Tabs
                            tabItemContainerStyle={styles.container}
                            inkBarStyle={styles.inkBar}
                            value={
                                this.validTabNames
                                    .indexOf(currentView) !== -1 ?
                                    currentView :
                                    state.tabSelected
                            }
                            onChange={this.handleTabSelect}
                            className="tabs-container"
                        >
                            <Tab
                                style={styles.tab}
                                label={this.validTabNames[0]}
                                value={this.validTabNames[0]}
                            >
                                <Settings />
                            </Tab>
                            {
                                loginManager.isAuthenticated() ?
                                    <Tab
                                        style={styles.tab}
                                        label={this.validTabNames[1]}
                                        value={this.validTabNames[1]}
                                    >
                                        <Profile />
                                    </Tab> : null
                            }
                            {
                                loginManager.isAuthenticated() ?
                                    <Tab
                                        style={styles.tab}
                                        label={this.validTabNames[2]}
                                        value={this.validTabNames[2]}
                                    >
                                        <Security />
                                    </Tab> : null
                            }
                        </Tabs>
                    </Fragment>
                </Route>
                <Redirect exact to={getPath(state.tabSelected)} />
            </Switch>
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
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            state: state.Account,
            appUi: state.appUi,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setState: AccountAction.setState,
            setApiToken: LoginManagerAction.setApiToken,
            setUserId: LoginManagerAction.setUserId,
            hideAlert,
            changeModalState,
        }, dispatch)
    )
)(Account)
