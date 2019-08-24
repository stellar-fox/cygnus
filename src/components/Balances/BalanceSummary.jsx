import React from "react"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { func } from "@xcmats/js-toolbox"
import {
    Grow,
    Card,
    CardContent,
} from "@material-ui/core"
import { accountIsLocked } from "../../lib/utils"
import BalanceSummaryHeader from "./BalanceSummaryHeader"
import BalanceSummaryFooter from "./BalanceSummaryFooter"
import LockedAccount from "./LockedAccount"
import NativeBalance from "./NativeBalance"
import AreaLine from "../Charts/AreaLine"




/**
 * Cygnus.
 *
 * Balance summary card.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<BalanceSummary>` component.
 *
 * @function BalanceSummary
 * @returns {React.ReactElement}
 */
const BalanceSummary = ({ accountId, classes, className, data, signers }) => {


    return <Grow in={true}><Card
        className={className}
        classes={{ root: classes.card }}
    >

        <BalanceSummaryHeader />
        <CardContent>
            <div className="flex-box-row items-centered space-between">
                <NativeBalance />
                <div className="chart-coin-history">
                    <AreaLine
                        id="chart-30d-change"
                        width="800"
                        height="240"
                        data={data}
                    />
                </div>
            </div>
            {accountIsLocked(signers, accountId) && <LockedAccount />}
        </CardContent>
        <BalanceSummaryFooter />
    </Card></Grow>
}




// ...
export default func.compose(
    withStyles((_theme) => ({
        card: {
            boxSizing: "border-box",
            borderRadius: "2px",
        },
    })),
    connect(
        (state) => ({
            accountId: state.StellarAccount.accountId,
            data: state.ExchangeRates.coinData.coin.history || [],
            signers: state.StellarAccount.signers,
        })
    ),
)(BalanceSummary)
