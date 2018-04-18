import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import hoistStatics from "hoist-non-react-statics"
import { authenticate } from "./api"

import {
    ActionConstants,
    changeLoginState,
} from "../../redux/actions"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"



// react's LoginManager context
const LoginManagerContext = React.createContext({})




// <LoginManager> component
export default connect(
    // map state to props.
    (state) => ({
        appAuth: state.appAuth,
        publicKey: state.LedgerHQ.publicKey,
        bip32Path: state.LedgerHQ.bip32Path,
        token: state.LoginManager.token,
        userId: state.LoginManager.userId,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
        changeLoginState,
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
    }, dispatch)
)(
    class extends Component {

        // ...
        attemptLogin = async (email, password) => {
            this.props.changeLoginState({
                loginState: ActionConstants.LOGGING_IN,
                userId: null,
                token: null,
            })
            const auth = await authenticate(email, password)

            if (!auth.authenticated) {
                this.props.changeLoginState({
                    loginState: ActionConstants.LOGGING_IN,
                    userId: null,
                    token: null,
                })
            } else {
                // consolidate credentials into LedgerHQ
                this.props.setApiToken(auth.token)
                this.props.setUserId(auth.user_id)
                this.props.setLedgerPublicKey(auth.pubkey)
                this.props.setLedgerBip32Path(auth.bip32Path)

                this.props.changeLoginState({
                    loginState: ActionConstants.LOGGED_IN,
                    userId: auth.user_id,
                    token: auth.token,
                })
            }

            return auth
        }


        // ...
        isAuthenticated = () => (
            this.props.appAuth.loginState === ActionConstants.LOGGED_IN  &&
            this.props.token
        )


        // ...
        isExploreOnly = () => (
            this.props.appAuth.loginState === ActionConstants.LOGGED_IN  &&
            this.props.publicKey  &&
            !this.props.bip32Path
        )


        // ...
        isPayEnabled = () => (
            this.props.appAuth.loginState === ActionConstants.LOGGED_IN  &&
            this.props.publicKey  &&
            this.props.bip32Path
        )


        // ...
        render = () =>
            <LoginManagerContext.Provider value={this}>
                { this.props.children }
            </LoginManagerContext.Provider>

    }

)




// <withLoginManager(...)> HOC
export const withLoginManager = (WrappedComponent) => {

    let
        // ...
        WithLoginManager = hoistStatics(
            class extends Component {

                // ...
                static propTypes = {
                    forwardedRef: PropTypes.func,
                }

                // ...
                render = () => (
                    ({ forwardedRef, ...restOfTheProps }) =>
                        React.createElement(
                            LoginManagerContext.Consumer, null,
                            (loginManager) =>
                                React.createElement(WrappedComponent, {
                                    ...restOfTheProps,
                                    ref: forwardedRef,
                                    loginManager,
                                })
                        )
                )(this.props)

            },
            WrappedComponent
        ),

        // ...
        forwardRef = (props, ref) =>
            React.createElement(WithLoginManager,
                { ...props, forwardedRef: ref, }
            )

    // ...
    forwardRef.displayName =
        `withLoginManager(${
            WrappedComponent.displayName || WrappedComponent.name
        })`

    // ...
    forwardRef.WrappedComponent = WrappedComponent

    // ...
    return React.forwardRef(forwardRef)

}
