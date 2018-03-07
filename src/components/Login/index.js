import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import TextInputField from "../TextInputField"
import RaisedButton from "material-ui/RaisedButton"
import LinearProgress from "material-ui/LinearProgress"
import { setToken, clearToken } from "../../actions/auth"
import {emailIsValid, passwordIsValid} from "./helper"
import { authenticate } from "./api"
import "./index.css"

class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            buttonDisabled: false,
            displayProgressStyle: "none",
            error: "",
        }
    }


    async loginValidator () {
        // INVALID EMAIL FORMAT
        if (!emailIsValid(this.email.state.value)) {
            this.email.setState({ error: "Invalid email format.", })
            return
        }

        // INVALID PASSWORD LENGTH
        if (!passwordIsValid(this.password.state.value)) {
            this.password.setState({ error: "Invalid password length.", })
            return
        }
    
        // PROCEED WITH REQUEST
        this.setState(_ => ({
            buttonDisabled: true,
            displayProgressStyle: "",
        }))
        
        const auth = await authenticate(
            this.email.state.value,
            this.password.state.value
        )
        
        this.setState(_ => ({
            buttonDisabled: false,
            displayProgressStyle: "none",
        }))

        // NOT AUTHENTICATED
        if (!auth.authenticated) {
            this.props.clearToken()
            this.email.setState({ error: auth.error, })
            this.password.setState({ error: auth.error, })
            return
        }

        // ALL GOOD
        this.email.setState({ error: "", })
        this.password.setState({ error: "", })
        this.props.setToken(auth.token)
        
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
                display: this.state.displayProgressStyle,
            }} color="rgba(244,176,4,0.7)" />
        </div>)
    }
}

function mapStateToProps (_state) {
    return {}
}

function matchDispatchToProps (dispatch) {
    return bindActionCreators ({
        setToken,
        clearToken,
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Login)