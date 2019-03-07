import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import {
    compose,
    bindActionCreators,
} from "redux"
import { connect } from "react-redux"
import {
    Redirect,
    Route,
} from "react-router-dom"
import raf from "raf"
import { toBool } from "@xcmats/js-toolbox"
import {
    ConnectedSwitch as Switch,
    resolvePath,
    withStaticRouter,
} from "../StellarRouter"
import { Null } from "../../lib/utils"
import { firebaseApp } from "../../components/StellarFox"
import { action as AuthAction } from "../../redux/Auth"
import AlertModal from "./AlertModal"
import ConnectedSnackbar from "./ConnectedSnackbar"
import LoadingModal from "../LoadingModal"
import Welcome from "../Welcome"
import LoginView from "../LoginView"
import SignupView from "../SignupView"
import "./index.css"




// <Layout> component
export default compose(
    withStaticRouter,
    connect(
        // map state to props.
        (state) => ({
            authenticated: toBool(state.Auth.authenticated),
            loggedIn: toBool(state.LedgerHQ.publicKey),
            signupComplete: toBool(state.Auth.signupComplete),
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            setAuthState: AuthAction.setState,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            loggedIn: PropTypes.bool.isRequired,
            match: PropTypes.object.isRequired,
            staticRouter: PropTypes.object.isRequired,
        }


        // ...
        constructor (props) {
            super(props)

            // relative resolve
            this.rr = resolvePath(this.props.match.path)

            // static paths
            this.props.staticRouter.addPaths({
                "Welcome": this.rr("."),
                "Bank": this.rr("bank/"),
                "LoginView": this.rr("login/"),
                "SignupView" : this.rr("signup/"),
            })
        }


        // ...
        state = { Bank: Null }


        // ...
        componentDidMount = () => raf(() => {

            firebaseApp.auth("session").onAuthStateChanged((user) => (
                user ? this.props.setAuthState({
                    authenticated: true,
                    verified: user.emailVerified,
                }) : this.props.setAuthState({
                    authenticated: false,
                }))
            )

            import("../Bank")
                .then((B) => this.setState(
                    () => ({ Bank: B.default })
                ))
        })


        // ...
        renderWelcome = (routeProps) =>
            !this.props.loggedIn ?
                <Welcome {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("Bank")} />


        // ...
        renderBank = (routeProps) =>
            this.props.loggedIn ?
                <this.state.Bank {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("Welcome")} />


        // ...
        renderLoginView = (routeProps) =>
            !this.props.loggedIn ?
                <LoginView {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("Bank")} />


        // ...
        renderSignupView = (routeProps) =>
            !this.props.signupComplete ?
                <SignupView {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("Bank")} />


        // ...
        render = () => (
            (getPath) =>
                <Fragment>
                    <AlertModal />
                    <LoadingModal />
                    <ConnectedSnackbar />
                    <Switch>
                        <Route exact path={getPath("Welcome")}>
                            { this.renderWelcome }
                        </Route>
                        <Route path={getPath("Bank")}>
                            { this.renderBank }
                        </Route>
                        <Route path={getPath("LoginView")}>
                            { this.renderLoginView }
                        </Route>
                        <Route path={getPath("SignupView")}>
                            {this.renderSignupView}
                        </Route>
                        <Redirect to={getPath("Welcome")} />
                    </Switch>
                </Fragment>
        )(this.props.staticRouter.getPath)

    }
)
