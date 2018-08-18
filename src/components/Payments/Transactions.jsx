import React, { Fragment } from "react"
import FailedTransactions from "./FailedTransactions"
import { Typography } from "@material-ui/core"



// <Transactions> component
export default () =>
    <Fragment>
        <Typography variant="body1" color="secondary">
            Saved Transactions
        </Typography>
        <Typography variant="caption" color="secondary">
            Transactions listed in the table below were not transmitted.
        </Typography>
        <FailedTransactions />
    </Fragment>
