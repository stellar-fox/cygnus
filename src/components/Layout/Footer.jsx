import React from "react"

import { withStyles } from "material-ui-next/styles"

import { env } from "../StellarFox"
import {
    emoji,
    htmlEntities as he,
} from "../../lib/utils"




// <Footer> component
export default withStyles({

    emoji: { color: "white", },

    footer: {
        backgroundColor: "#091b31",
        borderTop: "1px solid rgba(212, 228, 188, 0.4)",
        padding: 5,
        fontSize: "0.8em",
        color: "rgba(212, 228, 188, 0.6)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },

})(
    ({ classes, }) =>
        <div className={classes.footer}>
            <div className="flex-row-space-between">
                <div>
                    <he.Nbsp /><he.Nbsp />
                    <he.Copy /><he.Nbsp /><he.Nbsp />
                    <a target="_blank"
                        href={env.appLandingPageLink}
                    >
                        <b>{env.appName}</b>
                    </a>
                    <he.Nbsp /><he.Nbsp />
                    <span className={classes.emoji}><emoji.Fox /></span>
                    <he.Nbsp /><he.Nbsp />
                    {env.appCopyDates}.
                    <he.Nbsp />
                    <span className="tiny">
                        <a target="_blank" href={env.tos}>TOS</a>
                    </span>
                    <he.Nbsp />/<he.Nbsp />
                    <span className="tiny">
                        <a target="_blank" href={env.privacy}>Privacy</a>
                    </span>
                </div>
                <div>
                    ver.<he.Nbsp />
                    <b>{env.appVersion}</b>
                    <he.Nbsp /><he.Nbsp />
                    <span className={classes.emoji}><emoji.Rocket /></span>
                    <he.Nbsp /><he.Nbsp />
                </div>
            </div>
        </div>
)
