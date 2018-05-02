import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoadingModalAction } from "../../redux/LoadingModal"
import { action as StellarAccountAction } from "../../redux/StellarAccount"

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

import Panel from "../Panel"
import InputField from "../../lib/common/InputField"
import Button from "../../lib/mui-v1/Button"
import Switch from "../../lib/mui-v1/Switch"




// ...
const styles = {
    errorStyle: {
        color: "#912d35",
    },
    underlineStyle: {
        borderColor: "#FFC107",
    },
    floatingLabelStyle: {
        color: "rgba(212,228,188,0.4)",
    },
    floatingLabelFocusStyle: {
        color: "rgba(212,228,188,0.2)",
    },
    inputStyle: {
        color: "rgb(244,176,4)",
    },
}




// <PanelExplorer> component
class PanelExplorer extends Component {


    // ...
    setNetwork = (_event, value) => (
        value ?
            this.props.setHorizon(liveNetAddr) :
            this.props.setHorizon(testNetAddr)
    )


    // ...
    compoundFederationValidator = () => (
        (addressValidity) => addressValidity !== "" ?
            this.input.setState({error: addressValidity,}) :
            this.enterExplorer.call(this)
    )(invalidPaymentAddressMessage(this.input.state.value))


    // ...
    enterExplorer = async () => {
        const textInputValue = this.input.state.value

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
                this.input.setState({
                    error: error.message,
                })
            }

        // Input is a valid Stellar public key
        } else {
            this.props.setLedgerPublicKey(textInputValue)
        }

    }


    // ...
    render = () =>
        <Panel
            className="welcome-panel-right"
            title="Explore"
            content={
                <div>
                    <img
                        src="/img/stellar.svg"
                        width="120px"
                        alt="Stellar"
                    />
                    <div className="title">
                        To access global ledger
                        explorer enter your{" "}
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
                        <div className="f-e-col">
                            <InputField
                                name="payment-address-input"
                                type="text"
                                placeholder="Payment Address"
                                styles={styles}
                                ref={(self) => { this.input = self }}
                            />
                            <div>&nbsp;</div>
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
                    <div className="micro-font fade-strong">
                        “Stellar” is a trademark of the<he.Nbsp />
                        <a href={stellarFoundationLink} target="_blank">
                            Stellar Development Foundation
                        </a>.
                    </div>
                </div>
            }
        />
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
