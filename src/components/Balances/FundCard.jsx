import React, { Component } from "react"
import Paper from "../../lib/mui-v1/Paper"
import StripeCheckout from "../StripeCheckout"


// ...
class FundCard extends Component {


    // ...
    render = () =>
        <div style={{ padding: "0rem 0.8rem", }}>
            <Paper>
                <StripeCheckout />
            </Paper>
        </div>

}

export default FundCard
