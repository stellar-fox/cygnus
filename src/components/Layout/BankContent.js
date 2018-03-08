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
    path = {
        balances: `${this.props.basePath}balances/`,
        payments: `${this.props.basePath}payments/`,
        account: `${this.props.basePath}account/`,
    }


    // ...
    iBalances = inject(Balances, { basePath: this.path.balances, })
    iPayments = inject(Payments, { basePath: this.path.payments, })
    iAccount = inject(Account, { basePath: this.path.account, })


    // ...
    computeStyle = (drawerOpened) => ({
        paddingLeft: drawerOpened ? 200 : 20,
    })


    // ...
    state = {
        style: this.computeStyle(this.props.drawerOpened),
    }


    // ...
    componentWillReceiveProps = (nextProps) => {
        if (this.props.drawerOpened !== nextProps.drawerOpened) {
            this.setState({
                style: this.computeStyle(nextProps.drawerOpened),
            })
        }
    }


    // ...
    render = () =>
        <div style={this.state.style} className="bank-content">
            <Switch>
                <Route path={this.path.balances} component={this.iBalances} />
                <Route path={this.path.payments} component={this.iPayments} />
                <Route path={this.path.account} component={this.iAccount} />
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
