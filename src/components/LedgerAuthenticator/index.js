import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Input from "../../frontend/Input"
import Checkbox from "../../frontend/Checkbox"
import RaisedButton from "material-ui/RaisedButton"
import { awaitConnection, getPublicKey } from "../../lib/ledger"
import {
    logIn,
    setAccountRegistered,
    setPublicKey
} from "../../actions/index"
import { bip32Prefix } from "../../env.js"
import "./index.css"




// <LedgerAuthenticator> component
class LedgerAuthenticator extends Component {

    // ...
    state = {
        derivationPath: "0",
        pathEditable: false,
        useDefaultAccount: true,
        ledgerStatusMessage: "",
        errorCode: null,
    }


    // ...
    initQueryDevice = () => {
        let that = this
        return (async function _initQueryDevice () {
            that.setState({ ledgerStatusMessage: "Waiting for device ...", })
            let bip32Path = that.formBip32Path.call(that)
            const softwareVersion = await awaitConnection()

            // connection successful (softwareVersion is a string)
            if (typeof softwareVersion === "string") {
                that.setState({
                    ledgerStatusMessage:
                        `Connected. Software ver. ${softwareVersion}`,
                    errorCode: null,
                })
                const publicKey =
                    await getPublicKey(bip32Path)
                        .catch((error) => {
                            that.setState({
                                ledgerStatusMessage:
                                    that.errorCodeToUserMessage(
                                        error.statusCode
                                    ),
                                errorCode: error.statusCode,
                            })
                        })
                that.props.setPublicKey(publicKey)
                that.props.onConnected.call(that, {
                    publicKey,
                    softwareVersion,
                    bip32Path,
                    errorCode: null,
                    errorMessage: null,
                })
            }

            // error wih connection attempt
            else {
                that.setState({
                    ledgerStatusMessage: softwareVersion.message,
                    errorCode: softwareVersion.originalError.metaData.code,
                })
                that.props.onConnected.call(that, {
                    publicKey: null,
                    softwareVersion: null,
                    bip32Path: null,
                    errorCode: softwareVersion.originalError.metaData.code,
                    errorMessage: softwareVersion.message,
                })
            }
        }())
    }


    // ...
    errorCodeToUserMessage = (code) => {
        let message = ""
        switch (code) {
            case 26625:
                message = "Ledger is autolocked. Please unlock it first."
                break
            case "U2F_5":
                message = "Ledger sign in timeout. Device turned off or disconnected."
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
        <div className={this.props.className}>
            <Checkbox
                isChecked={this.state.useDefaultAccount}
                handleChange={this.handleCheckboxClick}
                label="Use Default Account"
            />
            {this.state.pathEditable ? (
                <div>
                    <div className="p-t-medium flex-start">
                        <Input
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
                    </div>
                </div>
            ) : null}
            <div className="p-t">
                <RaisedButton
                    onClick={this.initQueryDevice}
                    backgroundColor="rgb(244,176,4)"
                    label="Authenticate"
                />
                <div className="p-b-small" />
                <div className="tiny">
                    {this.state.ledgerStatusMessage}
                </div>
            </div>
        </div>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        auth: state.auth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        logIn,
        setAccountRegistered,
        setPublicKey,
    }, dispatch)
)(LedgerAuthenticator)
