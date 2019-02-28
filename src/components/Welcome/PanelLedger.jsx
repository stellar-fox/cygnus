import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import axios from "axios"
import { config } from "../../config"
import { ledgerSupportLink } from "../StellarFox/env"
import Panel from "../../lib/mui-v1/Panel"
import LedgerAuthenticator from "../LedgerAuthenticator"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { Typography } from "@material-ui/core"




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
        <Panel title="Login with Ledger Nano S">
            <div className="m-t-small panel-title">
                Sign-in by authenticating with your <em>Ledger device</em>.
            </div>
            <Typography align="center" variant="caption" color="secondary">
                Connect your Ledger Nano S device and select <i>Stellar</i> application.
                Need help? Visit <a target="_blank" rel="noopener noreferrer" href={ledgerSupportLink}>
                    Ledger Support
                </a>.
            </Typography>
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
