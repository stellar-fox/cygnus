import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { string } from "@xcmats/js-toolbox"
import { Typography } from "@material-ui/core"
import {
    fedToPub,
    invalidPaymentAddressMessage,
} from "../../lib/utils"
import {
    liveNetAddr,
    testNetAddr,
} from "../StellarFox/env"
import Panel from "../../lib/mui-v1/Panel"
import InputField from "../../lib/mui-v1/InputField"
import Button from "../../lib/mui-v1/Button"
// import Switch from "../../lib/mui-v1/Switch"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoadingModalAction } from "../../redux/LoadingModal"
import { action as StellarAccountAction } from "../../redux/StellarAccount"





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
        <Panel title="View-only access">
            <div style={{ height: "300px" }}>
                <div className="m-t-small panel-title">
                    To access transparent account information enter <em>
                    Payment Address</em> or <em>Public Key</em>.
                </div>
                <Typography align="center" variant="caption" color="secondary">
                    Account transactions and balances are
                    always publicly visible on the
                    globally distributed ledger.
                </Typography>

                {/* <div className="m-t f-b space-between">
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
            </div> */}

                <div className="flex-box-col items-centered content-centered">
                    <InputField
                        id="payment-address-input"
                        type="text"
                        label="Payment Address"
                        color="secondary"
                        error={this.state.error}
                        errorMessage={this.state.errorMessage}
                        onChange={this.updateInputValue}
                    />
                    <Button
                        onClick={this.compoundFederationValidator}
                        color="secondary"
                        style={{ marginRight: "0px" }}
                    >
                        Check
                    </Button>
                </div>
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
