import React, { Component } from "react"
import "./style.css"
import Input from "../../frontend/input/Input"
import Checkbox from '../../frontend/checkbox/Checkbox'
import RaisedButton from 'material-ui/RaisedButton'

export class LedgerAuthenticator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ledgerSupported: false,
            derivationPath: "0",
            derivationPrefix: "44'/148'/",
            derivationPathIndex: 0,
            pathEditable: false,
            useDefaultAccount: true,
        }
    }

    componentDidMount() {
        if (navigator.userAgent.indexOf("Chrome") !== -1) {
            this.setState({
                ledgerSupported: true
            })
        }
    }

    handlePathChange(event) {
        event.persist()
        if (isNaN(event.target.value)) {
            return false
        }
        this.setState({
            derivationPath: event.target.value,
            derivationPathIndex: parseInt(event.target.value, 10)
        })
    }

    handleCheckboxClick(event) {
        event.persist()
        this.setState({
            useDefaultAccount: event.target.checked
        })
        this.setState((prevState) => ({
            pathEditable: !event.target.checked
        }))
        // reset derivation path index to 0
        if (event.target.checked) {
            this.setState((prevState) => ({
                derivationPath: '0',
                derivationPathIndex: 0
            }))
        }
    }

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
                        onClick={this.props.onClick.bind(this)}
                        disabled={this.props.disabled}
                        backgroundColor="rgb(244,176,4)"
                        label="Authenticate"
                    />
                </div>
            </div>
        )
    }

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