import React from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { rgb } from "../../lib/utils"
import { withStyles } from "@material-ui/core/styles"

import {
    appName,
    liveNetAddr,
} from "../StellarFox/env"




// <BankAppBarTitle> component
export default compose(
    withStyles({

        appBarTitle: {
            float: "left",
            color: rgb(15, 46, 83),
            fontWeight: "normal",
        },

        barTitle: {
            lineHeight: "45px",
            fontSize: "1.1em",
        },

        barSubtitle: {
            lineHeight: "5px",
            fontSize: "15px",
        },

        indicatorSetCol: {
            float: "left",
            lineHeight: "15px",
            padding: "10px 0px",
            marginLeft: "16px",
            fontSize: "14px",
        },

    }),
    connect(
        // map state to props.
        (state) => ({
            ledgerConnected: state.LedgerHQ.connected,
            horizon: state.StellarAccount.horizon,
        })
    )
)(
    ({ classes, horizon, ledgerConnected, viewName }) =>
        <div>
            <div className={classes.appBarTitle}>
                <div className={classes.barTitle}>{appName}</div>
                <div className={classes.barSubtitle}>{viewName}</div>
            </div>
            <div className={classes.indicatorSetCol}>
                <div
                    className={
                        horizon === liveNetAddr ?
                            "badge-success" : "badge-error"
                    }
                >
                    { horizon === liveNetAddr ? "Public Net" : "Test Net" }
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
