import React, { Component, Fragment } from "react"
import History from "./History"




// <PaymentsHistory> component
class PaymentsHistory extends Component {


    // ...
    render = () =>
        <Fragment>
            <div className="account-title">Payments History</div>
            <div className="account-subtitle">
                Newest payments shown as first.
            </div>
            <History />
        </Fragment>
}




// ...
export default PaymentsHistory
