import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"
import { config } from "../../config"
import { ledgerSupportLink } from "../StellarFox/env"
import Panel from "../Panel"
import LedgerAuthenticator from "../LedgerAuthenticator"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"




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
                        className="lcars-input"
                    />
                </div>
            }
        />
}


// ...
export default connect(
    // map state to props.
    (_state) => ({
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        setLedgerPublicKey: LedgerHQAction.setPublicKey,
        setLedgerBip32Path: LedgerHQAction.setBip32Path,
        setApiToken: LoginManagerAction.setApiToken,
        setUserId: LoginManagerAction.setUserId,
    }, dispatch)
)(PanelLedger)
