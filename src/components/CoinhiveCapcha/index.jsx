import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { Checkbox, LinearProgress, Typography } from "@material-ui/core"
import { bindActionCreators, compose } from "redux"
import { coinHiveScriptSrc } from "../StellarFox/env"
import { connect } from "react-redux"
import loadScript from "load-script"
import { config } from "../../config"



// <CoinhiveCapcha> component
export default compose(
    withStyles(theme => ({
        colorPrimary: {
            color: theme.palette.primary.main,
        },
        disabled: {
            color: `${theme.palette.primary.disabled} !important`,
        },
        barRoot: {
            width: "100px",
            height: "18px",
            borderRadius: "3px",
            border: `1px solid ${theme.palette.secondary.dark}`,
        },

        barColorPrimary: {
            backgroundColor: theme.palette.primary.fade,
        },

    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
        }


        // ...
        state = {
            scriptLoaded: false,
            scriptError: false,
            disabled: false,
            hashesPerSecond: 0,
            totalHashes: 0,
            minerRunning: false,
            token: "",
            foundHash: "",
            progressValue: 0,
        }


        // ...
        componentDidMount = () => {
            if (!this.miner) {
                loadScript(coinHiveScriptSrc, (err, _script) => {
                    if (err) {
                        this.setState({
                            scriptError: true,
                            scriptLoaded: true,
                        })
                        return
                    }
                    this.setState({
                        scriptError: false,
                        scriptLoaded: true,
                    })
                    this.miner = new window.CoinHive.Token(
                        config.coinHive.siteKey, 256
                    )
                })
            }
        }


        // ...
        update = () => {

            this.setState({
                hashesPerSecond: this.miner.getHashesPerSecond(),
                totalHashes: this.miner.getTotalHashes(),
                minerRunning: this.miner.isRunning(),
            })
        }



        // ...
        validate = () => {
            this.setState({ disabled: true, })
            this.miner.start()

            this.interval = setInterval(() => this.update(), 100)

            this.miner.on("authed", () => {
                this.setState({ token: this.miner.getToken(), })
            })

            this.miner.on("close", () => {
                clearInterval(this.interval)
                this.miner.stop()
                this.setState({ minerRunning: this.miner.isRunning(), })
            })

            this.miner.on("found", (params) => {
                this.setState({ foundHash: params.result, })
            })

        }


        // ...
        render = () => (
            ({ classes, }) =>
                <Fragment>
                    {this.state.scriptLoaded ?
                        <Fragment>
                            <div className="flex-box-row items-centered">
                                <Checkbox disabled={this.state.disabled}
                                    classes={{
                                        colorPrimary: classes.colorPrimary,
                                        disabled: classes.disabled,
                                    }}
                                    onChange={this.validate}
                                    color="primary"
                                />
                                <LinearProgress
                                    color="primary"
                                    variant="determinate"
                                    value={this.state.progressValue}
                                    classes={{
                                        root: classes.barRoot,
                                        colorPrimary: classes.colorPrimary,
                                        barColorPrimary: classes.barColorPrimary,
                                    }}
                                />
                            </div>
                            <Typography variant="caption" color="primary">
                                {`Status: ${this.state.minerRunning}`}
                            </Typography>
                            <Typography variant="caption" color="primary">
                                {`H/s: ${this.state.hashesPerSecond}`}
                            </Typography>
                            <Typography variant="caption" color="primary">
                                {`Total: ${this.state.totalHashes}`}
                            </Typography>
                            <Typography variant="caption" color="primary">
                                {`Found: ${this.state.foundHash}`}
                            </Typography>
                        </Fragment> :
                        <Typography variant="caption" color="primary">
                            Kapeć stęchł.
                        </Typography>
                    }
                </Fragment>
        )(this.props)

    }
)
