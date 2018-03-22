import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import InputField from "../../frontend/InputField"
import RaisedButton from "material-ui/RaisedButton"
import LinearProgress from "material-ui/LinearProgress"
import { withLoginManager } from "../LoginManager"
import {
    emailIsValid,
    passwordIsValid,
} from "./helper"
import { ActionConstants, changeLoginState, } from "../../actions"

import "./index.css"




// <Login> component
class Login extends Component {

    // ...
    state = {
        buttonDisabled: false,
        progressBarOpacity: "0",
        error: "",
    }


    // ...
    loginValidator = async () => {

        // INVALID EMAIL FORMAT
        if (!emailIsValid(this.email.state.value)) {
            this.email.setState({ error: "Invalid email format.", })
            return
        } else {
            this.email.setState({ error: "", })
        }

        // INVALID PASSWORD LENGTH
        if (!passwordIsValid(this.password.state.value)) {
            this.password.setState({ error: "Invalid password length.", })
            return
        } else {
            this.password.setState({ error: "", })
        }

        // PROCEED WITH REQUEST
        this.setState(_ => ({
            buttonDisabled: true,
            progressBarOpacity: "1",
        }))

        this.props.loginManager.attemptLogin(
            this.email.state.value,
            this.password.state.value
        ).catch((error) => {
            // eslint-disable-next-line no-console
            console.log("Unknown Error: ", error)
        }).then((auth) => {
            if (!auth.authenticated) {
                this.setState(_ => ({
                    buttonDisabled: false,
                    progressBarOpacity: "0",
                }))
                this.email.setState({ error: auth.error, })
                this.password.setState({ error: auth.error, })
                this.props.changeLoginState({
                    loginState: ActionConstants.LOGGED_OUT,
                    bip32Path: null,
                    publicKey: null,
                    userId: null,
                    token: null,
                })
            }
        })

    }


    // ...
    render = () =>
        <div className="f-e-col">
            <InputField
                name="login-email"
                type="email"
                placeholder="Email"
                onEnterPress={this.loginValidator.bind(this)}
                ref={(self) => { this.email = self }}
            />
            <InputField
                name="login-password"
                type="password"
                placeholder="Password"
                onEnterPress={this.loginValidator.bind(this)}
                ref={(self) => { this.password = self }}
            />
            <RaisedButton
                onClick={this.loginValidator.bind(this)}
                backgroundColor="rgb(244,176,4)"
                label="Login"
                disabled={this.state.buttonDisabled}
                fullWidth={true}
                className="m-t"
            />
            <LinearProgress mode="indeterminate" style={{
                marginTop: "6px",
                background: "rgb(15,46,83)",
                height: "1px",
                opacity: this.state.progressBarOpacity,
            }} color="rgba(244,176,4,0.7)" />
        </div>

}


// ...
export default withLoginManager(connect(
    // map state to props.
    (state) => ({
        auth: state.auth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
    }, dispatch)
)(Login))
