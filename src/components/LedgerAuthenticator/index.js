import React, { Component } from "react"
import "./style.css"
import Input from "../../frontend/input/Input"
import Checkbox from "../../frontend/checkbox/Checkbox"
import RaisedButton from "material-ui/RaisedButton"
import {awaitConnection, getPublicKey} from "../../lib/ledger"

export default class LedgerAuthenticator extends Component {
    
    // ...
    constructor(props) {
        super(props)
        this.state = {
            ledgerSupported: false,
            derivationPath: "0",
            derivationPrefix: "44'/148'/",
            pathEditable: false,
            useDefaultAccount: true,
            ledgerStatusMessage: "",
        }
    }


    // ...
    componentDidMount() {
        if (navigator.userAgent.indexOf("Chrome") !== -1) {
            this.setState({
                ledgerSupported: true
            })
        }
    }


    // ...
    async initQueryDevice() {
        this.setState({
            ledgerStatusMessage: "Waiting for device ..."
        })
        let bip32Path = this.formBip32Path.call(this)
        const softwareVersion = await awaitConnection().catch((error) => {
            this.setState({
                ledgerStatusMessage: `${error.id}. ${error.message}`
            })
        })
        if (softwareVersion) {
            this.setState({
                ledgerStatusMessage: `Connected. Software Ver. ${softwareVersion}`
            })
            const publicKey = await getPublicKey(bip32Path).catch((error) => {
                this.setState({
                    ledgerStatusMessage: `${error.id}. ${error.message}`
                })
            })
            this.props.onConnected.call(
                this, { publicKey, softwareVersion, bip32Path }
            )
        }
    }


    // ...
    formBip32Path() {
        if (this.state.derivationPath === "") {
            return `${this.state.derivationPrefix}0'`
        } else {
            return `${this.state.derivationPrefix}${this.state.derivationPath}'`
        } 
    }


    // ...
    handlePathChange(event) {
        event.persist()
        if (isNaN(event.target.value)) {
            return false
        } else {
            this.setState({
                derivationPath: event.target.value,
            })
        }
    }


    // ...
    handleCheckboxClick(event) {
        event.persist()
        this.setState({
            useDefaultAccount: event.target.checked
        })
        this.setState(() => ({
            pathEditable: !event.target.checked
        }))
        // reset derivation path to 0
        if (event.target.checked) {
            this.setState(() => ({
                derivationPath: "0",
            }))
        }
    }


    // ...
    _widgetOn() {
        return (
            <div className={this.props.className}>
                <Checkbox
                    isChecked={this.state.useDefaultAccount}
                    handleChange={this.handleCheckboxClick.bind(this)}
                    label='Use Default Account'
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
                                handleChange={this.handlePathChange.bind(this)}
                                subLabel={`Account Derivation Path: [${this.state.derivationPrefix}${this.state.derivationPath}']`}
                            />
                        </div>
                    </div>
                ) : null}
                <div className="p-t">
                    <RaisedButton
                        onClick={this.initQueryDevice.bind(this)}
                        backgroundColor="rgb(244,176,4)"
                        label="Authenticate"
                    />
                    <div className="p-b-small"></div>
                    <div className="tiny">
                        {this.state.ledgerStatusMessage}
                    </div>
                </div>
            </div>
        )
    }


    // ...
    _widgetOff() {
        return (
            <div className="title-small p-t">
                This browser doesn’t support the FIDO U2F standard yet.
                We recommend updating to the latest <a target="_blank"
                    rel="noopener noreferrer" href="https://www.google.com/chrome/">
                Google Chrome</a> in order to use your Ledger device.
            </div>
        )
    }


    // ...
    render() {
        return (
            <div>
                {this.state.ledgerSupported ?
                    this._widgetOn.call(this) :
                    this._widgetOff.call(this)}
            </div>
        )
    }
}
