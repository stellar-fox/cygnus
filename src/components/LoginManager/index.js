import React, { Component } from "react"
import PropTypes from "prop-types"
import hoistStatics from "hoist-non-react-statics"
import { ActionConstants } from "../../actions"
import { authenticate } from "./api"




// <LoginManager> component
export default class LoginManager extends Component {

    // ...
    static childContextTypes = {
        loginManager: PropTypes.object,
    }


    // ...
    getChildContext = () => ({ loginManager: this, })


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
    render = () => this.props.children

}




// <withLoginManager(...)> HOC
export const withLoginManager = (WrappedComponent) =>
    hoistStatics(
        class WithLoginManager extends Component {

            // ...
            static contextTypes = {
                loginManager: PropTypes.object.isRequired,
            }

            // ...
            static propTypes = {
                wrappedComponentRef: PropTypes.func,
            }

            // ...
            static displayName =
                `withLoginManager(${
                    WrappedComponent.displayName || WrappedComponent.name
                })`

            // ...
            static WrappedComponent = WrappedComponent

            // ...
            render = () => (
                ({ wrappedComponentRef, ...restOfTheProps }) =>
                    React.createElement(WrappedComponent, {
                        ...restOfTheProps,
                        ref: wrappedComponentRef,
                        loginManager: this.context.loginManager,
                    })
            )(this.props)

        },
        WrappedComponent
    )
