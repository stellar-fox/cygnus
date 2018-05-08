import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"

import { withLoginManager } from "../LoginManager"
import {
    emailIsValid,
    passwordIsValid,
} from "./helper"

import { withStyles } from "material-ui-next/styles"

import { LinearProgress } from "material-ui-next"
import InputField from "../../lib/common/InputField"
import Button from "../../lib/mui-v1/Button"




// <Login> component
export default compose(
    withStyles({

        barRoot: {
            height: "1px",
            marginBottom: "6px",
        },

        colorPrimary: {
            backgroundColor: "rgb(15, 46, 83)",
        },

        barColorPrimary: {
            backgroundColor: "rgb(246, 190, 49)",
        },

    }),
    withLoginManager
)(
    class Login extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            buttonDisabled: false,
            progressBarOpacity: 0,
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
            this.setState(() => ({
                buttonDisabled: true,
                progressBarOpacity: 1,
            }))

            this.props.loginManager.attemptLogin(
                this.email.state.value,
                this.password.state.value
            ).catch((error) => {
                // eslint-disable-next-line no-console
                console.log("Unknown Error: ", error)
            }).then((auth) => {
                if (!auth.authenticated) {
                    this.setState(() => ({
                        buttonDisabled: false,
                        progressBarOpacity: 0,
                    }))
                    this.email.setState({ error: auth.error, })
                    this.password.setState({ error: auth.error, })
                }
            })

        }


        // ...
        render = () =>
            <Fragment>
                <InputField
                    style={{ display: "block", margin: "0 auto", }}
                    name="login-email"
                    type="email"
                    placeholder="Email"
                    onEnterPress={this.loginValidator}
                    ref={(self) => { this.email = self }}
                />
                <InputField
                    style={{ display: "block", margin: "0 auto", }}
                    name="login-password"
                    type="password"
                    placeholder="Password"
                    onEnterPress={this.loginValidator}
                    ref={(self) => { this.password = self }}
                />
                <div className="p-t"></div>
                <div className="blockcenter" style={{ width: 256, }}>
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            root: this.props.classes.barRoot,
                            colorPrimary: this.props.classes.colorPrimary,
                            barColorPrimary: this.props.classes.barColorPrimary,
                        }}
                        style={{ opacity: this.state.progressBarOpacity, }}
                    />
                    <Button
                        onClick={this.loginValidator}
                        disabled={this.state.buttonDisabled}
                        fullWidth={true}
                        color="secondary"
                    >
                        Login
                    </Button>
                </div>
            </Fragment>

    }
)
