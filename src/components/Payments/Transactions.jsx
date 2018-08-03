import React, { Component, Fragment } from "react"
import FailedTransactions from "./FailedTransactions"




// <Transactions> component
class Transactions extends Component {

    // ...
    render = () =>
        <Fragment>
            <div className="account-title">Saved/Failed Account Transactions</div>
            <div className="account-subtitle">
                Transactions listed in the table below were not transmitted.
            </div>
            <FailedTransactions />
        </Fragment>

}




// ...
export default Transactions
