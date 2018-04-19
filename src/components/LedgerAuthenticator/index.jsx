import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { bip32Prefix } from "../StellarFox/env"
import { getPublicKey } from "../../lib/ledger"
import {
    setAccountRegistered,
} from "../../redux/actions"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import Input from "../../lib/common/Input"
import Toggle from "../../lib/common/Toggle"
import Button from "../../lib/common/Button"

import "./index.css"




// <LedgerAuthenticator> component
class LedgerAuthenticator extends Component {

    // ...
    state = {
        derivationPath: "0",
        pathEditable: false,
        useDefaultAccount: true,
        buttonDisabled: false,
    }


    // ...
    componentDidMount = () => this.props.resetLedgerState()


    // ...
    initQueryDevice = async () => {
        let bip32Path = this.formBip32Path(),
            softwareVersion = null,
            publicKey = null
        try {
            softwareVersion = await this.props.getSoftwareVersion()
            this.setState({
                buttonDisabled: true,
            })
            publicKey = await getPublicKey(bip32Path)
            this.props.setLedgerPublicKey(publicKey)
            this.props.setLedgerBip32Path(this.state.derivationPath)
            this.props.onConnected.call(this, {
                publicKey,
                softwareVersion,
                bip32Path,
                errorMessage: null,
            })
        } catch (ex) {
            this.setState({
                buttonDisabled: false,
            })
            this.props.onConnected.call(this, {
                publicKey: null,
                softwareVersion: null,
                bip32Path: null,
                errorMessage: ex.message,
            })
        }
    }


    // ...
    errorCodeToUserMessage = (code) => {
        let message = ""
        switch (code) {
            case 26625:
                message =
                    "Ledger is autolocked. Please unlock it first."
                break
            case "U2F_5":
                message =
                    "Ledger sign in timeout. Device turned off or disconnected."
                break
            default:
                break
        }
        return message
    }


    // ...
    formBip32Path = () =>
        this.state.derivationPath === "" ?
            `${bip32Prefix}0'` :
            `${bip32Prefix}${this.state.derivationPath}'`


    // ...
    handlePathChange = (event) => {
        event.persist()
        if (isNaN(event.target.value)) {
            return false
        } else {
            this.setState({ derivationPath: event.target.value, })
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
            this.setState({ derivationPath: "0", })
        }
    }


    // ...
    render = () =>
        <Fragment>
            <div className="f-b">
                <div className="f-e-col">
                    <Toggle
                        label="Use default account"
                        onToggle={this.handleCheckboxClick}
                        toggled={this.state.useDefaultAccount}
                        labelStyle={{
                            color:
                                this.props.className.match(/reverse/) ?
                                    "rgb(15,46,83)" :
                                    "rgb(244,176,4)",
                        }}
                        thumbSwitchedStyle={{
                            backgroundColor:
                                this.props.className.match(/reverse/) ?
                                    "rgb(15,46,83)" :
                                    "rgb(244,176,4)",
                        }}
                        trackSwitchedStyle={{
                            backgroundColor:
                                this.props.className.match(/reverse/) ?
                                    "rgba(15,46,83,0.75)" :
                                    "rgba(244,176,4,0.75)",
                        }}
                    />
                    {
                        this.state.pathEditable ?
                            <Fragment>
                                <div className="p-t" />
                                <Input
                                    className={this.props.className}
                                    width="256px"
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
                            </Fragment> :
                            <div style={{width: "256px",}}></div>
                    }
                    <div className="p-t" />
                    <Button
                        disabled={this.state.buttonDisabled}
                        onClick={this.initQueryDevice}
                        primary={this.props.className.match(/reverse/)}
                        secondary={!this.props.className.match(/reverse/)}
                        fullWidth={true}
                        label="Authenticate"
                    />
                </div>
            </div>

            <div style={{marginTop: "2px",}} className="p-t-small">
                <div className="tiny placeholder-tiny">
                    {this.props.LedgerHQ.status}
                </div>
            </div>
        </Fragment>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        auth: state.auth,
        LedgerHQ: state.LedgerHQ,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        getSoftwareVersion: LedgerHQAction.getSoftwareVersion,
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
        resetLedgerState: LedgerHQAction.resetState,
        setAccountRegistered,
    }, dispatch)
)(LedgerAuthenticator)
