import React, { memo } from "react"
import { withStyles } from "@material-ui/core/styles"
import { FiberManualRecordRounded } from "@material-ui/icons"
import { Tooltip } from "@material-ui/core"




/**
 * Cygnus.
 *
 * Streamer indicator LED.
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
    classes, streamerConnected, streamerLedOn, title,
}) =>
    <div className={`${classes.led} ${streamerLedOn ?
        classes.ledOn : ""} ${streamerConnected ?
        classes.ledConnected : ""}`}
    >
        <Tooltip title={title} aria-label={title}>
            <FiberManualRecordRounded style={{ fontSize: "16px" }} />
        </Tooltip>
    </div>





// ...
export default memo(withStyles((_theme) => ({
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
}))(StreamerIndicator))
