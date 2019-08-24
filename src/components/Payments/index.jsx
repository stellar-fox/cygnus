import React, { Fragment } from "react"
import PaymentsTable from "../PaymentsTable"
import { Typography } from "@material-ui/core"




// ...
export default () =>
    <Fragment>
        <Typography variant="body1" color="secondary">
            Payment History
        </Typography>
        <Typography
            display="block"
            className="p-b"
            variant="caption"
            color="secondary"
        >
            Newest transactions shown as first.
        </Typography>
        <PaymentsTable />
    </Fragment>
