import React, { Fragment } from "react"
import FailedTransactions from "./FailedTransactions"




// <Transactions> component
export default () =>
    <Fragment>
        <div className="account-title">Saved/Failed Account Transactions</div>
        <div className="account-subtitle">
            Transactions listed in the table below were not transmitted.
        </div>
        <FailedTransactions />
    </Fragment>
