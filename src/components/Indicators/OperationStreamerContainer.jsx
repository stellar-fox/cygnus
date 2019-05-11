import React from "react"
import { connect } from "react-redux"
import StreamerIndicator from "./StreamerIndicator"



/**
 * Cygnus.
 *
 * Container for StreamerIndicator signaling operation events.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<OperationStreamerContainer>` component.
 *
 * @function OperationStreamerContainer
 * @returns {React.ReactElement}
 */
const OperationStreamerContainer = ({ streamerConnected, streamerLedOn }) =>
    <StreamerIndicator
        title="Operation"
        streamerConnected={streamerConnected}
        streamerLedOn={streamerLedOn}
    />





// ...
export default connect(
    (state) => ({
        streamerLedOn: state.Bank.streamerOperationLedOn,
        streamerConnected: state.Bank.streamerOperationConnected,
    }),
)(OperationStreamerContainer)
