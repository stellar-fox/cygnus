import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { ledgerSupportLink } from "../StellarFox/env"
import Panel from "../../lib/mui-v1/Panel"
import LedgerAuthenticator from "../LedgerAuthenticator"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { Typography } from "@material-ui/core"




// <PanelLedger> component
class PanelLedger extends Component {

    // ...
    setLedgerInfo = (ledgerParams) => {

        if (!ledgerParams.publicKey &&
            !ledgerParams.softwareVersion &&
            !ledgerParams.bip32Path) {
            return
        }

        this.props.setLedgerBip32Path(ledgerParams.bip32Path)
        this.props.setLedgerPublicKey(ledgerParams.publicKey)

    }


    // ...
    render = () =>
        <Panel title="Login with Ledger Nano S">
            <div style={{ minHeight: "310px" }}>
                <div className="m-t-small panel-title">
                    Use the light-weight client to transact
                    by using your hardware key ring.
                </div>
                <Typography align="center" variant="caption" color="secondary">
                    Connect your Ledger Nano S device and select <i>Stellar</i> application.
                    Need help? Visit <a target="_blank" rel="noopener noreferrer" href={ledgerSupportLink}>
                        Ledger Support
                    </a>.
                </Typography>
                <LedgerAuthenticator
                    onConnected={this.setLedgerInfo}
                    className="welcome-lcars-input"
                />
            </div>
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
