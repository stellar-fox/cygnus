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

import "./Content.css"




// ...
class Content extends Component {

    // ...
    balancesPath = `${this.props.basePath}balances/`
    iBalances = inject(Balances, { basePath: this.balancesPath, })
    paymentsPath = `${this.props.basePath}payments/`
    iPayments = inject(Payments, { basePath: this.paymentsPath, })
    accountPath = `${this.props.basePath}account/`
    iAccount = inject(Account, { basePath: this.accountPath, })


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
        <div style={this.state.style} className="content">
            <Switch>
                <Route path={this.balancesPath} component={this.iBalances} />
                <Route path={this.paymentsPath} component={this.iPayments} />
                <Route path={this.accountPath} component={this.iAccount} />
            </Switch>
        </div>

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(Content)
