import React from "react"
import { connect } from "react-redux"
import { appName } from "../StellarFox/env"

import "./BankAppBarTitle.css"




// <BankAppBarTitle> component
export default connect(
    // map state to props.
    (state) => ({ ledgerConnected: state.LedgerHQ.connected, })
)(
    ({ ledgerConnected, viewName, }) =>
        <div className="flex-start">
            <div className="app-bar-title">
                <div className="bar-title">{appName}</div>
                <div className="bar-subtitle">{viewName}</div>
            </div>
            <div className="indicator-set-col">
                <div className="badge">test net</div>
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
