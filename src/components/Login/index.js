import React, { Component } from "react"
import TextInputField from "../TextInputField"
import RaisedButton from "material-ui/RaisedButton"
import LinearProgress from "material-ui/LinearProgress"
import {emailIsValid, passwordIsValid} from "./helper"
import { authenticate } from "./api"
import { ActionConstants } from "../../actions/index"
import "./index.css"


export default class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            buttonDisabled: false,
            progressBarOpacity: "0",
            error: "",
        }
    }


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

        const auth = await authenticate(
            this.email.state.value,
            this.password.state.value
        )

        this.setState(_ => ({
            buttonDisabled: false,
            progressBarOpacity: "0",
        }))

        // NOT AUTHENTICATED
        if (!auth.authenticated) {
            this.email.setState({ error: "Invalid Credentials.", })
            this.password.setState({ error: "Invalid Credentials.", })
            return
        }
        // ALL GOOD
        this.props.setLoginState(ActionConstants.LOGGED_IN)
    }


    render () {
        return (<div className="f-e-col">
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
        </div>)
    }
}
