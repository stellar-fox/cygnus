import React from "react"

import { withStyles } from "@material-ui/core/styles"

import { env } from "../StellarFox"
import {
    emoji,
    htmlEntities as he,
} from "../../lib/utils"




// <Footer> component
export default withStyles({

    emoji: { color: "white" },

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

})(
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
                    <he.Nbsp /><he.Nbsp />
                    <a
                        style={{ fontSize: "9px" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={env.tos}
                    >
                        Terms
                    </a>|
                    <a
                        style={{ fontSize: "9px" }}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={env.privacy}
                    >
                        Privacy
                    </a>
                </div>
                <div>
                    ver.<he.Nbsp />
                    <b>{env.appVersion}</b>
                    <he.Nbsp /><he.Nbsp />
                    <span className={classes.emoji}><emoji.Rocket /></span>
                </div>
            </div>
        </div>
)
