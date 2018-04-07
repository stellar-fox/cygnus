import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"

import {
    ActionConstants,
    changeLoginState,
    setModalLoading,
    setModalLoaded,
    updateLoadingMessage,
} from "../../redux/actions/"

import {
    htmlEntities as he,
    federationLookup,
    errorMessageForInvalidPaymentAddress,
} from "../../lib/utils"
import { stellarFoundationLink } from "../StellarFox/env"

import Panel from "../Panel"
import InputField from "../../lib/common/InputField"
import Button from "../../lib/common/Button"




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
    compoundFederationValidator = () => (
        (addressValidity) => addressValidity ?
            this.input.setState({error: addressValidity,}) :
            this.enterExplorer.call(this)
    )(errorMessageForInvalidPaymentAddress(this.input.state.value))


    // ...
    enterExplorer = () => {
        const textInputValue = this.input.state.value

        this.props.setModalLoading()

        /**
         * textInputValue is either VALID federation or VALID pubkey
         * check for '*' character - if present then it is federation address
         * otherwise a public key
         */
        if (textInputValue.match(/\*/)) {
            this.props.updateLoadingMessage({
                message: "Looking up federation endpoint ...",
            })
            federationLookup(textInputValue)
                .then((federationEndpointObj) => {
                    if (federationEndpointObj.ok) {
                        axios
                            .get(`${
                                federationEndpointObj.endpoint
                            }?q=${
                                textInputValue
                            }&type=name`)
                            .then((response) => {
                                this.props.changeLoginState({
                                    loginState: ActionConstants.LOGGED_IN,
                                    bip32Path: null,
                                    publicKey: response.data.account_id,
                                    userId: null,
                                    token: null,
                                })
                                this.props.setModalLoading()
                                this.props.updateLoadingMessage({
                                    message: "Searching for Account ...",
                                })
                            })
                            .catch((error) => {
                                this.props.setModalLoaded()
                                if (error.response.status === 404) {
                                    this.input.setState({
                                        error: "Account not found.",
                                    })
                                    return false
                                }
                                if (error.response.data.detail) {
                                    this.input.setState({
                                        error: error.response.data.detail,
                                    })
                                } else {
                                    this.input.setState({
                                        error: error.response.data.message,
                                    })
                                }
                            })
                    }
                })
                .catch((error) => {
                    this.props.setModalLoaded()
                    this.input.setState({
                        error: error.message,
                    })
                })
        } else {
            this.props.changeLoginState({
                loginState: ActionConstants.LOGGED_IN,
                bip32Path: null,
                publicKey: textInputValue,
                userId: null,
                token: null,
            })
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
                        publicly accessible on the
                        global ledger. Anyone who
                        knows your account number or
                        payment address can view
                        your public transactions.
                    </div>
                    <div className="f-b">
                        <div className="f-e-col">
                            <InputField
                                name="payment-address-input"
                                type="text"
                                placeholder="Payment Address"
                                styles={styles}
                                ref={(self) => {
                                    this.input = self
                                }}
                            />
                            <div className="p-t"></div>
                            <Button
                                onClick={this.compoundFederationValidator}
                                backgroundColor="rgb(244,176,4)"
                                label="Check"
                                secondary={true}
                                fullWidth={true}
                            />
                        </div>
                    </div>
                    <div className="p-t micro-font fade-strong">
                        “Stellar” is a trademark of the<he.Nbsp />
                        <a href={stellarFoundationLink}>Stellar Development
                        Foundation.</a>
                    </div>
                </div>
            }
        />
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
        appAuth: state.appAuth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
        setModalLoading,
        setModalLoaded,
        updateLoadingMessage,
    }, dispatch)
)(PanelExplorer)
