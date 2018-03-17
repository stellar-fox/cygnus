import React, { Component } from "react"
import {
    Route,
    Switch,
} from "react-router-dom"
import { connect } from "react-redux"
import { inject } from "../../lib/utils"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./BankContent.css"




// ...
class BankContent extends Component {

    // ...
    iBalances = inject(Balances, { basePath: this.props.routes.Balances, })
    iPayments = inject(Payments, { basePath: this.props.routes.Payments, })
    iAccount = inject(Account, { basePath: this.props.routes.Account, })


    // ...
    computeStyle = (drawerOpened) => ({
        paddingLeft: drawerOpened ? 200 : 20,
    })


    // ...
    state = {
        style: this.computeStyle(this.props.drawerOpened),
    }


    // ...
    componentWillReceiveProps = ({ drawerOpened, }) => {
        if (this.props.drawerOpened !== drawerOpened) {
            this.setState({
                style: this.computeStyle(drawerOpened),
            })
        }
    }


    // ...
    render = () =>
        <div style={this.state.style} className="bank-content">
            <Switch>
                <Route path={this.props.routes.Balances} component={this.iBalances} />
                <Route path={this.props.routes.Payments} component={this.iPayments} />
                <Route path={this.props.routes.Account} component={this.iAccount} />
            </Switch>
        </div>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(BankContent)
