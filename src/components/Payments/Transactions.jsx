import React, { Component, Fragment } from "react"
import FailedTransactions from "./FailedTransactions"




// <Transactions> component
class Transactions extends Component {

    // ...
    render = () =>
        <Fragment>
            <div className="account-title">Account Transactions</div>
            <div className="account-subtitle">
                Newest transactions shown as first.
            </div>
            <FailedTransactions />
        </Fragment>

}




// ...
export default Transactions
