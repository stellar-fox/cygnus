import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"

import { config } from "../../config"
import { htmlEntities as he } from "../../lib/utils"
import { ledgerSupportLink } from "../StellarFox/env"

import Panel from "../../lib/mui-v1/Panel"
import LedgerAuthenticator from "../LedgerAuthenticator"

import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"

import ledgerhqlogo from "./static/ledgerhqlogo.svg"




// <PanelLedger> component
class PanelLedger extends Component {

    // ...
    logInViaLedger = (ledgerParams) => {

        if (!ledgerParams.publicKey &&
            !ledgerParams.softwareVersion &&
            !ledgerParams.bip32Path) {
            return
        }

        this.props.setLedgerBip32Path(ledgerParams.bip32Path)
        this.props.setLedgerPublicKey(ledgerParams.publicKey)

        axios
            .post(
                `${config.api}/user/ledgerauth/${ledgerParams.publicKey}/${
                    ledgerParams.bip32Path}`
            )
            .then((response) => {
                this.props.setApiToken(response.data.token)
                this.props.setUserId(response.data.user_id)
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
                    // do nothing for now
                }
            })
    }


    // ...
    render = () =>
        <Panel title="Transact">
            <div className="panel-logo-container">
                <div className="panel-logo">
                    <img
                        className="img-logo"
                        src={ledgerhqlogo}
                        width="120px"
                        alt="LedgerHQ"
                    />
                </div>
            </div>
            <div className="panel-title">
                Sign-in by authenticating<br />
                with your Ledger device.
            </div>
            <div className="title-small p-t p-b">
                Connect your Ledger Nano S
                device. Make sure Stellar
                application is selected and
                browser support enabled. For
                more information visit<he.Nbsp />
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={ledgerSupportLink}
                >
                    Ledger Support
                </a>
            </div>
            <div className="m-t"></div>
            <LedgerAuthenticator
                onConnected={this.logInViaLedger}
                className="welcome-lcars-input"
            />
        </Panel>
}


// ...
export default connect(
    // map state to props.
    null,
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
    }, dispatch)
)(PanelLedger)
