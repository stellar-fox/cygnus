import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
    func,
    string,
} from "@xcmats/js-toolbox"
import {
    LinearProgress,
    Typography,
} from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { bip32Prefix } from "../StellarFox/env"
import { getPublicKey } from "../../lib/ledger"
import LCARSInput from "../../lib/common/LCARSInput"
import Button from "../../lib/mui-v1/Button"
import Switch from "../../lib/mui-v1/Switch"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"




// <LedgerAuthenticator> component
class LedgerAuthenticator extends Component {

    // ...
    state = {
        derivationPath: "0",
        pathEditable: false,
        useDefaultAccount: true,
        buttonDisabled: false,
        status: string.empty(),
        inProgress: false,
    }


    // ...
    componentDidMount = () => this.props.resetLedgerState()


    // ...
    initQueryDevice = async () => {
        let bip32Path = this.formBip32Path(),
            softwareVersion = null,
            publicKey = null

        try {
            await this.setState({
                buttonDisabled: true,
                status: "Waiting for device ...",
                inProgress: true,
            })
            softwareVersion = await this.props.getSoftwareVersion()
            await this.setState({
                buttonDisabled: true,
                status: "Fetching account ...",
                inProgress: true,
            })
            publicKey = await getPublicKey(bip32Path)
        } catch (ex) {
            await this.setState({
                buttonDisabled: false,
                status: `${ex.message}`,
                inProgress: false,
            })
            this.props.onConnected.call(this, {
                publicKey: null,
                softwareVersion: null,
                bip32Path: null,
                errorMessage: ex.message,
            })
            return false
        }
        await this.setState({
            status: `Connected. Version: ${softwareVersion}`,
            inProgress: false,
        })

        await this.props.setAccountId(publicKey)
        await this.props.setAccount(this.state.derivationPath)

        this.props.onConnected.call(this, {
            publicKey,
            softwareVersion,
            bip32Path: this.state.derivationPath,
            errorMessage: null,
        })
    }


    // ...
    errorCodeToUserMessage = (code) => {
        let message = string.empty()
        switch (code) {
            case 26625:
                message =
                    "Ledger is autolocked. Please unlock it first."
                break
            case "U2F_5":
                message =
                    "Ledger sign in timeout. " +
                    "Device turned off or disconnected."
                break
            default:
                break
        }
        return message
    }


    // ...
    formBip32Path = () =>
        this.state.derivationPath === string.empty() ?
            `${bip32Prefix}0'` :
            `${bip32Prefix}${this.state.derivationPath}'`


    // ...
    handlePathChange = (event) => {
        event.persist()
        if (isNaN(event.target.value)) {
            return false
        } else {
            this.setState({ derivationPath: event.target.value })
        }
    }


    // ...
    handleCheckboxClick = (event) => {
        event.persist()
        this.setState({
            useDefaultAccount: event.target.checked,
            pathEditable: !event.target.checked,
        })
        // reset derivation path to 0
        if (event.target.checked) {
            this.setState({ derivationPath: "0" })
        }
    }


    // ...
    render = () => (({ classes }) =>
        <div className="flex-box-col items-centered content-centered">
            <div className="m-t m-b flex-box-row items-centered content-centered">
                <Typography variant="body2" color={
                    this.props.className.match(/reverse/) ?
                        "primary" : "secondary"
                }
                >
                    Use default account
                </Typography>
                <Switch
                    disabled={this.state.inProgress}
                    checked={this.state.useDefaultAccount}
                    onChange={this.handleCheckboxClick}
                    color={
                        this.props.className.match(/reverse/) ?
                            "primary" : "secondary"
                    }
                />
            </div>

            { this.state.pathEditable &&
                <LCARSInput
                    autoFocus={true}
                    style={{ marginBottom: "1rem" }}
                    className={this.props.className}
                    label="Account Index"
                    inputType="text"
                    maxLength="5"
                    autoComplete="off"
                    value={this.state.derivationPath}
                    handleChange={this.handlePathChange}
                    subLabel={`Account Derivation Path: [${
                        bip32Prefix
                    }${this.state.derivationPath}']`}
                />
            }

            <div className="flex-box-col items-centered content-centered">
                <Button
                    disabled={this.state.buttonDisabled}
                    onClick={this.initQueryDevice}
                    color={
                        this.props.className.match(/reverse/) ?
                            "primary" : "secondary"
                    }
                    style={{ marginRight: "0px" }}
                >
                    Authenticate
                </Button>
                <LinearProgress
                    variant="indeterminate"
                    classes={{
                        colorPrimary: classes.linearColorPrimary,
                        barColorPrimary: classes.linearBarColorPrimary,
                    }}
                    style={{
                        width: "100%",
                        opacity: this.state.inProgress ? 1 : 0,
                    }}
                />
            </div>


            <Typography style={{marginTop: "0.5rem"}} variant="caption" color={
                this.props.className.match(/reverse/) ?
                    "primary" : "secondary"
            }
            >{this.state.status}</Typography>

        </div>)(this.props)


}


// ...
export default func.compose(
    withStyles((theme) => ({

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
        // map state to props.
        (state) => ({
            LedgerHQ: state.LedgerHQ,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            getSoftwareVersion: LedgerHQAction.getSoftwareVersion,
            setAccountId: LedgerHQAction.setPublicKey,
            setAccount: LedgerHQAction.setBip32Path,
            resetLedgerState: LedgerHQAction.resetState,
        }, dispatch)
    ),
)(LedgerAuthenticator)
