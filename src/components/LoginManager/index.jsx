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




// react's LoginManager context
const LoginManagerContext = React.createContext({})




// <LoginManager> component
export default connect(
    // map state to props.
    (state) => ({ appAuth: state.appAuth, }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
    }, dispatch)
)(
    class extends Component {

        // ...
        attemptLogin = async (email, password) => {
            this.props.changeLoginState({
                loginState: ActionConstants.LOGGING_IN,
                bip32Path: null,
                publicKey: null,
                userId: null,
                token: null,
            })
            const auth = await authenticate(email, password)

            if (!auth.authenticated) {
                this.props.changeLoginState({
                    loginState: ActionConstants.LOGGING_IN,
                    bip32Path: null,
                    publicKey: null,
                    userId: null,
                    token: null,
                })
            } else {
                this.props.changeLoginState({
                    loginState: ActionConstants.LOGGED_IN,
                    bip32Path: auth.bip32Path,
                    publicKey: auth.pubkey,
                    userId: auth.user_id,
                    token: auth.token,
                })
            }

            return auth
        }


        // ...
        isAuthenticated = () => (
            this.props.appAuth.loginState === ActionConstants.LOGGED_IN  &&
            this.props.appAuth.token
        )


        // ...
        isExploreOnly = () => (
            this.props.appAuth.loginState === ActionConstants.LOGGED_IN  &&
            this.props.appAuth.publicKey  &&
            !this.props.appAuth.bip32Path
        )


        // ...
        isPayEnabled = () => (
            this.props.appAuth.loginState === ActionConstants.LOGGED_IN  &&
            this.props.appAuth.publicKey  &&
            this.props.appAuth.bip32Path
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
