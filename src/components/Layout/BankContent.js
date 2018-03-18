import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    Route,
} from "react-router-dom"
import { connect } from "react-redux"
import { inject } from "../../lib/utils"
import { ConnectedSwitch as Switch } from "../StellarRouter"

import Balances from "../Balances"
import Payments from "../Payments"
import Account from "../Account"

import "./BankContent.css"




// ...
class BankContent extends Component {

    // ...
    static contextTypes = {
        staticRoutes: PropTypes.object.isRequired,
    }


    // ...
    componentWillMount = () => {
        this._sr = this.context.staticRoutes

        // ...
        this.iBalances = inject(Balances, { basePath: this._sr.Balances, })
        this.iPayments = inject(Payments, { basePath: this._sr.Payments, })
        this.iAccount = inject(Account, { basePath: this._sr.Account, })
    }


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
                <Route path={this._sr.Balances} component={this.iBalances} />
                <Route path={this._sr.Payments} component={this.iPayments} />
                <Route path={this._sr.Account} component={this.iAccount} />
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
