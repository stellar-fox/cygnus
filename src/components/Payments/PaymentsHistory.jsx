import React, { Fragment } from "react"
import History from "./History"




// <PaymentsHistory> component
export default () =>
    <Fragment>
        <div className="account-title">Payments History</div>
        <div className="account-subtitle">
            Newest transactions shown as first.
        </div>
        <History />
    </Fragment>
