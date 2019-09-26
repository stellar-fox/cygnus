import React, { Component, Fragment, lazy, Suspense } from "react"
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
import Action from "../StellarFox/Action"
import AlertModal from "./AlertModal"
import Welcome from "../Welcome"
import "./index.css"
import Snacky from "../../lib/mui-v1/Snacky"
import { clearInputErrorMessages } from "../../thunks/users"
import SuspenseLoader from "../Layout/SuspenseLoader"

const Faq = lazy(() => import("../StellarFox/Faq"))
const Features = lazy(() => import("../Welcome/Features"))
const LoginView = lazy(() => import("../LoginView"))
const Pgp = lazy(() => import("../StellarFox/Pgp"))
const Prices = lazy(() => import("../StellarFox/Prices"))
const Privacy = lazy(() => import("../StellarFox/Privacy"))
const Reset = lazy(() => import("../StellarFox/Reset"))
const SignupView = lazy(() => import("../SignupView"))
const Support = lazy(() => import("../StellarFox/Support"))
const Terms = lazy(() => import("../StellarFox/Terms"))
const Why = lazy(() => import("../Welcome/Why"))


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
            clearInputErrorMessages,
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
                "Action": this.rr("action/"),
                "Bank": this.rr("bank/"),
                "LoginView": this.rr("login/"),
                "SignupView" : this.rr("signup/"),
                "Why": this.rr("why/"),
                "TermsOfService": this.rr("terms/"),
                "Privacy": this.rr("privacy/"),
                "Faq": this.rr("faq/"),
                "Pgp": this.rr("pgp/"),
                "Features": this.rr("features/"),
                "Prices": this.rr("prices/"),
                "Reset": this.rr("reset/"),
                "Support": this.rr("support/"),
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
        renderAction = (routeProps) => {
            this.props.clearInputErrorMessages()
            return <Action {...routeProps} />
        }


        // ...
        renderBank = (routeProps) =>
            this.props.loggedIn ?
                <this.state.Bank {...routeProps} /> :
                <Redirect to={this.props.staticRouter.getPath("Welcome")} />


        // ...
        renderLoginView = (routeProps) =>
            !this.props.loggedIn ?
                <Suspense fallback={<SuspenseLoader />}>
                    <LoginView {...routeProps} />
                </Suspense> :
                <Redirect to={this.props.staticRouter.getPath("Bank")} />


        // ...
        renderSignupView = (routeProps) =>
            !this.props.signupComplete ?
                <Suspense fallback={<SuspenseLoader />}>
                    <SignupView {...routeProps} />
                </Suspense> :
                <Redirect to={this.props.staticRouter.getPath("Bank")} />


        // ...
        renderWhyView = (routeProps) =>
            <Suspense fallback={<SuspenseLoader />}>
                <Why {...routeProps} />
            </Suspense>


        // ...
        renderTerms = (routeProps) => 
            <Suspense fallback={<SuspenseLoader />}>
                <Terms {...routeProps} />
            </Suspense>


        // ...
        renderPrivacy = (routeProps) => 
            <Suspense fallback={<SuspenseLoader />}>
                <Privacy {...routeProps} />
            </Suspense>


        // ...
        renderFaq = (routeProps) => 
            <Suspense fallback={<SuspenseLoader />}>
                <Faq {...routeProps} />
            </Suspense>


        // ...
        renderPgp = (routeProps) => 
            <Suspense fallback={<SuspenseLoader />}>
                <Pgp {...routeProps} />
            </Suspense>


        // ...
        renderFeatures = (routeProps) =>
            <Suspense fallback={<SuspenseLoader />}>
                <Features {...routeProps} />
            </Suspense>


        // ...
        renderPrices = (routeProps) =>
            <Suspense fallback={<SuspenseLoader />}>
                <Prices {...routeProps} />
            </Suspense>


        // ...
        renderReset = (routeProps) => {
            this.props.clearInputErrorMessages()
            return <Suspense fallback={<SuspenseLoader />}>
                <Reset {...routeProps} />
            </Suspense>
        }


        // ...
        renderSupport = (routeProps) =>
            <Suspense fallback={<SuspenseLoader />}>
                <Support {...routeProps} />
            </Suspense>


        // ...
        render = () => (
            (getPath) =>
                <Fragment>
                    <Snacky />
                    <AlertModal />
                    <Switch>
                        <Route exact path={getPath("Welcome")}>
                            { this.renderWelcome }
                        </Route>
                        <Route path={getPath("Action")}>
                            { this.renderAction }
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
                        <Route path={getPath("Why")}>
                            {this.renderWhyView}
                        </Route>
                        <Route path={getPath("TermsOfService")}>
                            {this.renderTerms}
                        </Route>
                        <Route path={getPath("Privacy")}>
                            {this.renderPrivacy}
                        </Route>
                        <Route path={getPath("Faq")}>
                            {this.renderFaq}
                        </Route>
                        <Route path={getPath("Pgp")}>
                            {this.renderPgp}
                        </Route>
                        <Route path={getPath("Features")}>
                            {this.renderFeatures}
                        </Route>
                        <Route path={getPath("Prices")}>
                            {this.renderPrices}
                        </Route>
                        <Route path={getPath("Reset")}>
                            {this.renderReset}
                        </Route>
                        <Route path={getPath("Support")}>
                            {this.renderSupport}
                        </Route>
                        <Redirect to={getPath("Welcome")} />
                    </Switch>
                </Fragment>
        )(this.props.staticRouter.getPath)

    }
)
