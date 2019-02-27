import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import {
    fedToPub,
    htmlEntities as he,
    invalidPaymentAddressMessage,
} from "../../lib/utils"
import {
    liveNetAddr,
    testNetAddr,
    stellarFoundationLink,
} from "../StellarFox/env"

import Panel from "../../lib/mui-v1/Panel"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
import Switch from "../../lib/mui-v1/Switch"

import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoadingModalAction } from "../../redux/LoadingModal"
import { action as StellarAccountAction } from "../../redux/StellarAccount"

import stellarlogo from "../StellarFox/static/stellar-logo.svg"




// <PanelExplorer> component
class PanelExplorer extends Component {

    state = {
        error: false,
        errorMessage: string.empty(),
        inputValue: string.empty(),
    }


    // ...
    setNetwork = (_event, value) => (
        value ? this.props.setHorizon(liveNetAddr) :
            this.props.setHorizon(testNetAddr)
    )


    // ...
    compoundFederationValidator = () => (
        (addressValidity) => addressValidity !== string.empty() ?
            this.setState({
                errorMessage: addressValidity,
                error: true,
            }) :
            this.setState({
                errorMessage: string.empty(),
                error: false,
            }, () => {
                this.enterExplorer()
            })
    )(invalidPaymentAddressMessage(this.state.inputValue))


    // ...
    updateInputValue = (event) => this.setState({
        inputValue: event.target.value,
    })


    // ...
    enterExplorer = async () => {
        const textInputValue = this.state.inputValue

        // textInputValue is either VALID federation or VALID pubkey
        // check for '*' character - if present then it is federation address
        // otherwise a public key
        if (textInputValue.match(/\*/)) {
            try {
                this.props.showLoadingModal("Looking up Payment Address ...")
                this.props.setLedgerPublicKey(await fedToPub(textInputValue))
                this.props.showLoadingModal("Searching for Account ...")
            } catch (error) {
                this.props.hideLoadingModal()
                this.setState({
                    error: true,
                    errorMessage: error.message,
                })
            }

        // Input is a valid Stellar public key
        } else {
            this.props.setLedgerPublicKey(textInputValue)
        }

    }


    // ...
    render = () =>
        <Panel title="Read only access">
            <div className="panel-logo-container">
                <div className="panel-logo">
                    <img
                        className="img-logo"
                        src={stellarlogo}
                        width="120px"
                        alt="Stellar"
                    />
                </div>
            </div>
            <div className="panel-title">
                To access ledger explorer<br />
                enter your<he.Nbsp />
                <em>Payment Address</em>.
            </div>
            <div className="title-small p-t p-b">
                Your account operations are
                publicly visible on the
                global ledger.
            </div>

            <div className="m-t f-b space-between">
                <div>
                    <div className="account-title">
                        Use live network
                    </div>
                    <div className="text-secondary account-subtitle">
                        Explore transactions conducted on live network.
                    </div>
                </div>
                <div>
                    <Switch
                        checked={this.props.horizon === liveNetAddr}
                        onChange={this.setNetwork}
                        color="secondary"
                    />
                </div>
            </div>

            <div className="f-b">
                <div className="blockcenter">
                    <InputField
                        id="payment-address-input"
                        type="text"
                        label="Payment Address"
                        color="secondary"
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                        onChange={this.updateInputValue}
                        fullWidth
                    />
                    <Button
                        onClick={this.compoundFederationValidator}
                        color="secondary"
                        fullWidth={true}
                    >
                        Check
                    </Button>
                </div>
            </div>
            <div>&nbsp;</div>
            <div className="micro-font">
                “Stellar” is a trademark of the<he.Nbsp />
                <a href={stellarFoundationLink} target="_blank"
                    rel="noopener noreferrer"
                >
                    Stellar Development Foundation
                </a>.
            </div>
        </Panel>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        horizon: state.StellarAccount.horizon,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        showLoadingModal: LoadingModalAction.showLoadingModal,
        hideLoadingModal: LoadingModalAction.hideLoadingModal,
        setHorizon: StellarAccountAction.setHorizon,
    }, dispatch)
)(PanelExplorer)
