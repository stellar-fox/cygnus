import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"

import { withLoginManager } from "../LoginManager"
import {
    emailIsValid,
    passwordIsValid,
} from "./helper"

import LinearProgress from "material-ui/LinearProgress"
import InputField from "../../lib/common/InputField"
import Button from "../../lib/mui-v1/Button"

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
                onEnterPress={this.loginValidator}
                ref={(self) => { this.email = self }}
            />
            <InputField
                name="login-password"
                type="password"
                placeholder="Password"
                onEnterPress={this.loginValidator}
                ref={(self) => { this.password = self }}
            />
            <div className="p-t"></div>
            <LinearProgress
                mode="indeterminate"
                style={{
                    marginBottom: "6px",
                    background: "rgb(15,46,83)",
                    height: "1px",
                    opacity: this.state.progressBarOpacity,
                }}
                color="rgba(244,176,4,0.7)"
            />
            <Button
                onClick={this.loginValidator}
                disabled={this.state.buttonDisabled}
                fullWidth={true}
                color="secondary"
                className="m-t"
            >Login</Button>
        </div>

}


// ...
export default compose(
    withLoginManager,
    connect(
        // map state to props.
        (state) => ({
            auth: state.auth,
        }),
    )
)(Login)
