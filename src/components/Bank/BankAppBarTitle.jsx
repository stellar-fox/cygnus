import React from "react"
import { connect } from "react-redux"
import { appName, liveNet, } from "../StellarFox/env"

import "./BankAppBarTitle.css"




// <BankAppBarTitle> component
export default connect(
    // map state to props.
    (state) => ({
        ledgerConnected: state.LedgerHQ.connected,
        horizon: state.StellarAccount.horizon,
    })
)(
    ({ ledgerConnected, viewName, horizon,}) =>
        <div className="flex-start">
            <div className="app-bar-title">
                <div className="bar-title">{appName}</div>
                <div className="bar-subtitle">{viewName}</div>
            </div>
            <div className="indicator-set-col">
                <div className={horizon === liveNet ? "badge-success" : "badge-error"}>
                    {horizon === liveNet ? "Public Net" : "Test Net"}
                </div>
                <div className="p-b-small" />
                <div>
                    {
                        ledgerConnected ?
                            <span className="ledger-nano-s"></span> :
                            <span>&nbsp;</span>
                    }
                </div>
            </div>
        </div>
)
