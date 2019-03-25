import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    FiberManualRecordRounded,
    FiberSmartRecordRounded,
} from "@material-ui/icons"
import { Tooltip } from "@material-ui/core"



/**
 * Cygnus.
 *
 * Streamers indicator led-pair.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<StreamerIndicator>` component.
 *
 * @function StreamerIndicator
 * @returns {React.ReactElement}
 */
const StreamerIndicator = ({
    accountId, classes, streamerOperationConnected, streamerOperationLedOn,
    streamerPaymentConnected, streamerPaymentLedOn,
}) => {

    return accountId && <div
        className="flex-box-row content-centered items-centered"
    >
        <div className={`${classes.led} ${streamerOperationLedOn ?
            classes.ledOn : ""} ${streamerOperationConnected ?
            classes.ledConnected : ""}`}
        >
            <Tooltip title="Operations" aria-label="Operations">
                <FiberManualRecordRounded style={{ fontSize: "16px" }} />
            </Tooltip>
        </div>
        <div className={`${classes.led} ${streamerPaymentLedOn ?
            classes.ledOn : ""} ${streamerPaymentConnected ?
            classes.ledConnected : ""}`}
        >
            <Tooltip title="Payments" aria-label="Payments">
                <FiberSmartRecordRounded style={{ fontSize: "16px" }} />
            </Tooltip>
        </div>
    </div>


}




// ...
export default func.compose(
    withStyles((_theme) => ({
        led: {
            fontSize: "1.2rem",
            fontWeight: "600",
            margin: "0px 3px",
        },

        ledConnected: {
            color: "rgb(0,139,82)",
        },

        ledOn: {
            color: "rgb(88,197,150)",
        },
    })),
    connect(
        (state) => ({
            accountId: state.LedgerHQ.publicKey,
            streamerPaymentLedOn: state.Bank.streamerPaymentLedOn,
            streamerPaymentConnected: state.Bank.streamerPaymentConnected,
            streamerOperationLedOn: state.Bank.streamerOperationLedOn,
            streamerOperationConnected: state.Bank.streamerOperationConnected,
        }),
        (dispatch) => bindActionCreators({

        }, dispatch),
    ),
)(StreamerIndicator)
