import React, { memo } from "react"
import { connect } from "react-redux"
import { CardHeader } from "@material-ui/core"
import { assetDescription } from "../../lib/asset-utils"
import ReserveInfo from "./ReserveInfo"




/**
 * `<BalanceSummaryHeader>` component.
 *
 * @module client-ui-components
 * @license Apache-2.0
 * @returns {React.ReactElement}
 */
const BalanceSummaryHeader = memo(({ currency }) =>
    <CardHeader
        style={{ zIndex: 1 }}
        title="Current Balance"
        subheader={assetDescription(currency)}
        action={<ReserveInfo />}
    />
)

export default connect (
    (state) => ({
        currency: state.Account.currency,
    })
)(BalanceSummaryHeader)
