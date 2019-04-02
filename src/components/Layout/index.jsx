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
import Faq from "../StellarFox/Faq"
import Features from "../Welcome/Features"
import LoginView from "../LoginView"
import Pgp from "../StellarFox/Pgp"
import Prices from "../StellarFox/Prices"
import Privacy from "../StellarFox/Privacy"
import SignupView from "../SignupView"
import Support from "../StellarFox/Support"
import Terms from "../StellarFox/Terms"
import Welcome from "../Welcome"
import Why from "../Welcome/Why"
import "./index.css"
import Snacky from "../../lib/mui-v1/Snacky"




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
                "Why": this.rr("why/"),
                "TermsOfService": this.rr("terms/"),
                "Privacy": this.rr("privacy/"),
                "Faq": this.rr("faq/"),
                "Pgp": this.rr("pgp/"),
                "Features": this.rr("features/"),
                "Prices": this.rr("prices/"),
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
        renderWhyView = (routeProps) => <Why {...routeProps} />


        // ...
        renderTerms = (routeProps) => <Terms {...routeProps} />


        // ...
        renderPrivacy = (routeProps) => <Privacy {...routeProps} />


        // ...
        renderFaq = (routeProps) => <Faq {...routeProps} />


        // ...
        renderPgp = (routeProps) => <Pgp {...routeProps} />


        // ...
        renderFeatures = (routeProps) => <Features {...routeProps} />


        // ...
        renderPrices = (routeProps) => <Prices {...routeProps} />


        // ...
        renderSupport = (routeProps) => <Support {...routeProps} />


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
                        <Route path={getPath("Support")}>
                            {this.renderSupport}
                        </Route>
                        <Redirect to={getPath("Welcome")} />
                    </Switch>
                </Fragment>
        )(this.props.staticRouter.getPath)

    }
)
