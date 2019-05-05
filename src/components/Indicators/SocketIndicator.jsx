import React from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import { FiberSmartRecordRounded } from "@material-ui/icons"
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
 * `<SocketIndicator>` component.
 *
 * @function SocketIndicator
 * @returns {React.ReactElement}
 */
const SocketIndicator = ({ classes, socketStatus }) => {

    const toTitle = (status) => ((translator) => translator[status])({
        0: "red",
        1: "blue",
        2: "yellow",
        3: "green",
        4: "gray",
    })

    const toTextStatus = (status) => ((translator) => translator[status])({
        0: "Connecting",
        1: "Opened",
        2: "Online",
        3: "Socket Connected",
        4: "Socket Disconnected",
    })


    return <div style={{marginLeft: "5px"}}
        className={`${classes.led} ${classes[toTitle(socketStatus)]}`}
    >
        <Tooltip
            title={toTextStatus(socketStatus)}
            aria-label={toTextStatus(socketStatus)}
        >
            <FiberSmartRecordRounded style={{ fontSize: "16px" }} />
        </Tooltip>
    </div>

}




// ...
export default func.compose(
    withStyles((theme) => ({
        led: {
            fontSize: "1.2rem",
            fontWeight: "600",
            margin: "0px 3px",
        },

        red: {
            color: "rgba(211, 47, 47, 0.8)",
        },

        yellow: {
            color: "rgba(246, 190, 49, 0.8)",
        },

        green: {
            color: "rgb(0,139,82)",
        },

        blue: {
            color: "rgb(102,174,217)",
        },

        gray: {
            color: theme.palette.disabledSwitchColor,
        },
    })),
    connect(
        (state) => ({
            socketStatus: state.Socket.status,
        }),
    ),
)(SocketIndicator)
