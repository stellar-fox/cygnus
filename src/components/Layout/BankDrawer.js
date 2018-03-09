import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import { push } from "react-router-redux"
import { inject } from "../../lib/utils"

import Drawer from "material-ui/Drawer"

import { selectView } from "../../actions/index"

import "./BankDrawer.css"




// ...
class BalancesNavLinkCore extends Component {

    // ...
    action = (e) => {
        e.preventDefault()
        if (this.props.path !== this.props.basePath) {
            this.props.push(this.props.basePath)
            this.props.selectView.call(this, "Balances")
        }
    }


    // ...
    render = () =>
        <NavLink
            className="menu-item"
            onClick={this.action}
            exact
            activeClassName="active"
            to={this.props.basePath}
        >
            <i className="material-icons">account_balance_wallet</i>
            Balances
        </NavLink>

}


// ...
const BalancesNavLink = connect(
    // map state to props.
    (state) => ({
        path: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
        push,
    }, dispatch)
)(BalancesNavLinkCore)




// ...
class PaymentsNavLinkCore extends Component {

    // ...
    action = (e) => {
        e.preventDefault()
        if (this.props.path !== this.props.basePath) {
            this.props.push(this.props.basePath)
            this.props.selectView.call(this, "Payments")
        }
    }


    // ...
    render = () =>
        this.props.accountInfo.exists ?
            <NavLink
                className="menu-item"
                onClick={this.action}
                exact
                activeClassName="active"
                to={this.props.basePath}
            >
                <i className="material-icons">payment</i>
                Payments
            </NavLink> :
            null

}


// ...
const PaymentsNavLink = connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
        path : state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
        push,
    }, dispatch)
)(PaymentsNavLinkCore)




// ...
class AccountNavLinkCore extends Component {

    // ...
    action = (e) => {
        e.preventDefault()
        if (this.props.path !== this.props.basePath) {
            this.props.push(this.props.basePath)
            this.props.selectView.call(this, "Account")
        }
    }


    // ...
    render = () =>
        <NavLink
            className="menu-item"
            onClick={this.action}
            exact
            activeClassName="active"
            to={this.props.basePath}
        >
            <i className="material-icons">account_balance</i>
            Account
        </NavLink>

}


// ...
const AccountNavLink = connect(
    // map state to props.
    (state) => ({
        path: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
        push,
    }, dispatch)
)(AccountNavLinkCore)




// ...
class BankDrawer extends Component {

    // ...
    static style = {
        width: 180,
        height: "calc(100% - 100px)",
        top: 65,
        borderTop: "1px solid #052f5f",
        borderBottom: "1px solid #052f5f",
        borderLeft: "1px solid #052f5f",
        borderTopRightRadius: "3px",
        borderBottomRightRadius: "3px",
        backgroundColor: "#2e5077",
    }


    // ...
    iBalancesNavLink = inject(BalancesNavLink, { basePath: this.props.routes.balances, })
    iPaymentsNavLink = inject(PaymentsNavLink, { basePath: this.props.routes.payments, })
    iAccountNavLink = inject(AccountNavLink, { basePath: this.props.routes.account, })


    // ...
    render = () =>
        <Drawer
            containerStyle={BankDrawer.style}
            open={this.props.drawerOpened}
        >
            <Route component={this.iBalancesNavLink} />
            <Route component={this.iPaymentsNavLink} />
            <Route component={this.iAccountNavLink} />
        </Drawer>

}


//
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(BankDrawer)
