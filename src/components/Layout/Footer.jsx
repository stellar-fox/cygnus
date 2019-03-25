import React from "react"
import { compose } from "redux"
import { withStyles } from "@material-ui/core/styles"
import { env } from "../StellarFox"
import {
    htmlEntities as he,
} from "../../lib/utils"
import StreamerIndicator from "../StreamerIndicator"




// <Footer> component
export default compose(
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
)(
    ({ classes }) =>
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
                    <StreamerIndicator />
                </div>
            </div>
        </div>
)
