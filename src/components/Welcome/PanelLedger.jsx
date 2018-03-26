import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"

import { config } from "../../config"
import { ledgerSupportLink } from "../StellarFox/env"
import { extractPathIndex } from "../../lib/utils"

import {
    ActionConstants,
    changeLoginState,
    setAccountRegistered,
} from "../../actions/"

import Panel from "../Panel"
import LedgerAuthenticator from "../LedgerAuthenticator"




// <PanelLedger> component
class PanelLedger extends Component {

    // ...
    logInViaLedger = (ledgerParams) => {
        // TODO: fix this with Ledger API
        if (ledgerParams.errorCode !== null) {
            return
        }

        axios
            .post(
                `${config.api}/user/ledgerauth/${
                    ledgerParams.publicKey
                }/${
                    extractPathIndex(ledgerParams.bip32Path)
                }`
            )
            .then((response) => {
                this.props.setAccountRegistered(true)
                this.props.changeLoginState({
                    loginState: ActionConstants.LOGGED_IN,
                    bip32Path: extractPathIndex(ledgerParams.bip32Path),
                    publicKey: ledgerParams.publicKey,
                    userId: response.data.user_id,
                    token: response.data.token,
                })
            })
            .catch((error) => {
                // This will happen when back-end is offline.
                if (!error.response) {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                    return
                }
                // User not found
                if (error.response.status === 401) {
                    this.props.setAccountRegistered(false)
                    this.props.changeLoginState({
                        loginState: ActionConstants.LOGGED_IN,
                        publicKey: ledgerParams.publicKey,
                        bip32Path: extractPathIndex(ledgerParams.bip32Path),
                        userId: null,
                        token: null,
                    })
                } else {
                    // eslint-disable-next-line no-console
                    console.log(error.response.statusText)
                }
            })
    }


    // ...
    render = () =>
        <Panel
            className="welcome-panel-left"
            title="Transact"
            content={
                <div>
                    <img
                        src="/img/ledger.svg"
                        width="120px"
                        alt="Ledger"
                    />
                    <div className="title">
                        Sign-in by authenticating
                        with your Ledger device.
                    </div>
                    <div className="title-small p-t p-b">
                        Connect your Ledger Nano S
                        device. Make sure Stellar
                        application is selected and
                        browser support enabled. For
                        more information visit{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={ledgerSupportLink}
                        >
                            Ledger Support
                        </a>
                    </div>
                    <LedgerAuthenticator
                        onConnected={this.logInViaLedger}
                    />
                </div>
            }
        />
}


// ...
export default connect(
    // map state to props.
    (state) => ({
        appAuth: state.appAuth,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
        setAccountRegistered,
    }, dispatch)
)(PanelLedger)
