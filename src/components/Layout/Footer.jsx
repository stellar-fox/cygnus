import React, { Fragment, memo } from "react"
import { compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { env } from "../StellarFox"
import {
    htmlEntities as he,
} from "../../lib/utils"
import SocketIndicator from "../Indicators/SocketIndicator"
import OperationStreamerContainer from "../Indicators/OperationStreamerContainer"
import PaymentStreamerContainer from "../Indicators/PaymentStreamerContainer"




// <Footer> component
export default memo(compose(
    withStyles({
        footer: {
            backgroundColor: "#091b31",
            borderTop: "1px solid rgba(212, 228, 188, 0.4)",
            padding: 5,
            fontSize: "0.8em",
            lineHeight: "1.2em",
            color: "rgba(212, 228, 188, 0.6)",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
        },

        tiny: {
            fontSize: "0.8em",
            lineHeight: "1.2em",
            verticalAlign: "middle",
            color: "rgba(255, 255, 255, 0.5)",
        },
    }),
    connect(
        (state) => ({
            accountId: state.LedgerHQ.publicKey,
        }),
    ),
)(
    ({ accountId, classes }) =>
        <div className={classes.footer}>
            <div className="flex-box-row space-between">
                <div>
                    <he.Copy /><he.Nbsp />
                    <a target="_blank"
                        rel="noopener noreferrer"
                        href={env.appLandingPageLink}
                    >
                        <b>{env.appName}</b>
                    </a>
                    <he.Nbsp /><he.Nbsp />
                    <b>{env.appCopyDates}</b>.
                </div>
                <div className="flex-box-row items-centered content-centered">
                    <div>ver. <b>{env.appVersion}</b></div>

                    {accountId && <Fragment>
                        <SocketIndicator />
                        <OperationStreamerContainer />
                        <PaymentStreamerContainer />
                    </Fragment>}

                </div>
            </div>
        </div>
))
