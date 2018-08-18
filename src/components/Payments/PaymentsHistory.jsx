import React, { Fragment } from "react"
import History from "./History"
import { Typography } from "@material-ui/core"



// <PaymentsHistory> component
export default () =>
    <Fragment>
        <Typography variant="body1" color="secondary">
            Payment History
        </Typography>
        <Typography variant="caption" color="secondary">
            Newest transactions shown as first.
        </Typography>
        <History />
    </Fragment>
