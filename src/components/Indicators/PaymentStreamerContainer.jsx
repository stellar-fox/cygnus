import React from "react"
import { connect } from "react-redux"
import StreamerIndicator from "./StreamerIndicator"



/**
 * Cygnus.
 *
 * Container for StreamerIndicator signaling payment events.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<PaymentStreamerContainer>` component.
 *
 * @function PaymentStreamerContainer
 * @returns {React.ReactElement}
 */
const PaymentStreamerContainer = ({ streamerConnected, streamerLedOn }) =>
    <StreamerIndicator
        title="Payment"
        streamerConnected={streamerConnected}
        streamerLedOn={streamerLedOn}
    />





// ...
export default connect(
    (state) => ({
        streamerLedOn: state.Bank.streamerPaymentLedOn,
        streamerConnected: state.Bank.streamerPaymentConnected,
    }),
)(PaymentStreamerContainer)
