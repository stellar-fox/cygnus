import React, { Component } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import {
    Grid,
    LinearProgress,
    Typography,
} from "@material-ui/core"
import logo from "../StellarFox/static/cygnusYellow.svg"
import {
    updatePassword,
    validateLink,
} from "../../thunks/users"
import { string } from "@xcmats/js-toolbox"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import StatusMessage from "../StatusMessage"
import { Link } from "react-router-dom"




// <ResetPassword> component
export default compose(
    withStyles((theme) => ({
        appLogo: {
            [theme.breakpoints.up("md")]: {
                height: "60px",
                width: "60px",
            },
            [theme.breakpoints.down("sm")]: {
                height: "40px",
                width: "40px",
            },
        },
        container: {
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "100%",
        },
        linearColorPrimary: {
            marginTop: "2px",
            backgroundColor: theme.palette.secondary.light,
            borderRadius: "3px",
        },
        linearBarColorPrimary: {
            backgroundColor: theme.palette.secondary.dark,
            borderRadius: "3px",
        },
    })),

    connect(
        (state) => ({
            passwordInputError: state.Errors.passwordInputError,
        }),
        (dispatch) => bindActionCreators({
            updatePassword,
            validateLink,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            inProgress: true,
            error: false,
            errorMessage: string.empty(),
            email: string.empty(),
            password: string.empty(),
            linkValid: false,
            success: false,
            updating: false,
            passwordInputError: false,
            passwordInputErrorMessage: string.empty(),
        }


        // ...
        componentDidMount = async () => {
            try {
                const email = await this.props.validateLink(this.props.oobCode)
                await this.setState({
                    email,
                    linkValid: true,
                })
            } catch (error) {
                await this.setState({
                    error: true,
                    errorMessage: error.message,
                })

            } finally {
                await this.setState({
                    inProgress: false,
                })
            }
        }


        // ...
        handleInputChange = async (e) => await this.setState({
            password: e.target.value,
        })


        // ...
        handleButtonClick = async () => {
            try {
                await this.setState({
                    updating: true,
                })
                await this.props.updatePassword(
                    this.props.oobCode,
                    this.state.email,
                    this.state.password
                )
                await this.setState({
                    success: true,
                })
            } catch (error) {
                await this.setState({
                    passwordInputError: true,
                    passwordInputErrorMessage: error.message,
                })
            } finally {
                await this.setState({
                    updating: false,
                })
            }
        }


        // ...
        render = () => (({ classes }) =>

            <Grid
                className={classes.container}
                container
                direction={"column"}
                justify={"center"}
                alignItems={"center"}
                alignContent={"center"}
                wrap={"nowrap"}
                style={{
                    marginTop: "3rem",
                }}
            >
                <Grid item>
                    <img
                        className={classes.appLogo}
                        src={logo} alt="logo"
                    />
                </Grid>

                {this.state.inProgress &&
                <Grid item>
                    <Typography
                        align="center"
                        display="block"
                        variant="body1"
                        color="secondary"
                    >
                        Validating Link
                    </Typography>
                    <LinearProgress
                        variant="indeterminate"
                        classes={{
                            colorPrimary: classes.linearColorPrimary,
                            barColorPrimary: classes.linearBarColorPrimary,
                        }}
                        style={{ width: "100%" }}
                    />
                </Grid>
                }

                {this.state.error &&
                <Grid item>
                    <Typography
                        style={{ fontWeight: 600 }}
                        align="center"
                        display="block"
                        variant="body1"
                    >
                        <span className="red">Error</span>
                    </Typography>
                    <Typography
                        align="center"
                        display="block"
                        variant="h5"
                        color="secondary"
                    >
                        {this.state.errorMessage}
                    </Typography>
                </Grid>
                }

                {!this.state.inProgress && !this.state.error && !this.state.success &&
                <Grid item>
                    <div className="flex-box-col items-centered content-centered">
                        <InputField
                            id="password-input"
                            type="password"
                            label="New Password"
                            color="secondary"
                            error={this.props.passwordInputError}
                            onChange={this.handleInputChange}
                        />
                        <div>
                            <Button
                                onClick={this.handleButtonClick}
                                color="secondary"
                                style={{ marginRight: "0px" }}
                                disabled={this.state.updating}
                            >Update Password
                            </Button>
                            <LinearProgress
                                variant="indeterminate"
                                classes={{
                                    colorPrimary: classes.linearColorPrimary,
                                    barColorPrimary: classes.linearBarColorPrimary,
                                }}
                                style={{
                                    width: "100%",
                                    opacity: this.state.updating ? 1 : 0,
                                }}
                            />
                        </div>
                        <StatusMessage className="m-t" style={{ minHeight: "20px" }} />
                    </div>
                </Grid>
                }

                {this.state.success && !this.state.updating &&
                <Grid item>
                    <Typography
                        align="center"
                        display="block"
                        variant="body1"
                        color="secondary"
                    >
                        Password has been reset.
                    </Typography>
                    <Typography
                        align="center"
                        display="block"
                        variant="h5"
                        color="secondary"
                    >
                        You can now <Link target="_blank"
                            rel="noopener noreferrer" to="/login"
                        >sign in</Link> with new password.
                    </Typography>
                </Grid>
                }

            </Grid>
        )(this.props)
    }
)
