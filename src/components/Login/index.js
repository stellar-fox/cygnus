import React, { Component } from "react"
import TextInputField from "../TextInputField"
import RaisedButton from "material-ui/RaisedButton"
import LinearProgress from "material-ui/LinearProgress"
import {
    emailIsValid,
    passwordIsValid,
} from "./helper"
import { ActionConstants } from "../../actions"
import PropTypes from "prop-types"

import "./index.css"




// ...
export default class Login extends Component {

    // ...
    static contextTypes = {
        loginManager : PropTypes.object,
    }


    // ...
    state = {
        buttonDisabled: false,
        progressBarOpacity: "0",
        error: "",
    }


    // ...
    async loginValidator () {

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

        this.context.loginManager.attemptLogin(
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
            <TextInputField
                type="email"
                floatingLabelText="Email"
                onEnterPress={this.loginValidator.bind(this)}
                ref={(self) => { this.email = self }}
            />
            <TextInputField
                type="password"
                floatingLabelText="Password"
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
