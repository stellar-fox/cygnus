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
    processActionCode,
} from "../../thunks/users"
import { string } from "@xcmats/js-toolbox"
import { Link } from "react-router-dom"




// <VerifyEmail> component
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
            processActionCode,
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
            success: false,
        }


        // ...
        componentDidMount = async () => {
            try {
                await this.props.processActionCode(this.props.oobCode)
                await this.setState({
                    success: true,
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
                        variant="body1"
                    >
                        <span className="red">Error</span>
                    </Typography>
                    <Typography
                        align="center"
                        variant="h5"
                        color="secondary"
                    >
                        {this.state.errorMessage}
                    </Typography>
                </Grid>
                }

                {this.state.success && !this.state.updating &&
                <Grid item>
                    <Typography
                        align="center"
                        variant="body1"
                        color="secondary"
                    >
                        Email verified.
                    </Typography>
                    <Typography
                        align="center"
                        variant="h5"
                        color="secondary"
                    >
                        Please <Link target="_blank"
                            rel="noopener noreferrer" to="/login"
                        >sign in</Link> to reflect account changes.
                    </Typography>
                </Grid>
                }

            </Grid>
        )(this.props)
    }
)
