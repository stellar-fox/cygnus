import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import hoistStatics from "hoist-non-react-statics"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"




// LoginManager context
const LoginManagerContext = React.createContext({})




// <LoginManager> component
export default connect(
    // map state to props.
    (state) => ({
        publicKey: state.LedgerHQ.publicKey,
        bip32Path: state.LedgerHQ.bip32Path,
        token: state.LoginManager.token,
        userId: state.LoginManager.userId,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
    }, dispatch)
)(
    class extends Component {

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
                { ...props, forwardedRef: ref }
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
