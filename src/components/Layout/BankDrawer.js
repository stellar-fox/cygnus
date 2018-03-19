import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { push } from "react-router-redux"
import { bankDrawerWidth } from "../../env"
import { Provide } from "../../lib/utils"

import Drawer from "material-ui/Drawer"

import "./BankDrawer.css"




// ...
class BalancesNavLinkCore extends Component {

    // ...
    action = (e) => {
        e.preventDefault()
        if (this.props.currentPath !== this.props.paths.Balances) {
            this.props.push(this.props.paths.Balances)
        }
    }


    // ...
    render = () =>
        <NavLink
            className="menu-item"
            onClick={this.action}
            exact
            activeClassName="active"
            isActive={() => this.props.currentPath === this.props.paths.Balances}
            to={this.props.paths.Balances}
        >
            <i className="material-icons">account_balance_wallet</i>
            Balances
        </NavLink>

}


// ...
const BalancesNavLink = connect(
    // map state to props.
    (state) => ({
        currentPath: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        push,
    }, dispatch)
)(BalancesNavLinkCore)




// ...
class PaymentsNavLinkCore extends Component {

    // ...
    action = (e) => {
        e.preventDefault()
        if (this.props.currentPath !== this.props.paths.Payments) {
            this.props.push(this.props.paths.Payments)
        }
    }


    // ...
    render = () =>
        this.props.accountInfo.exists ?
            <NavLink
                className="menu-item"
                onClick={this.action}
                exact
                isActive={() => this.props.currentPath === this.props.paths.Payments}
                activeClassName="active"
                to={this.props.paths.Payments}
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
        currentPath : state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        push,
    }, dispatch)
)(PaymentsNavLinkCore)




// ...
class AccountNavLinkCore extends Component {

    // ...
    action = (e) => {
        e.preventDefault()
        if (this.props.currentPath !== this.props.paths.Account) {
            this.props.push(this.props.paths.Account)
        }
    }


    // ...
    render = () =>
        <NavLink
            className="menu-item"
            onClick={this.action}
            exact
            isActive={() => this.props.currentPath === this.props.paths.Account}
            activeClassName="active"
            to={this.props.paths.Account}
        >
            <i className="material-icons">account_balance</i>
            Account
        </NavLink>

}


// ...
const AccountNavLink = connect(
    // map state to props.
    (state) => ({
        currentPath: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        push,
    }, dispatch)
)(AccountNavLinkCore)




// ...
const style = {
    width: bankDrawerWidth,
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
class BankDrawer extends Component {

    // ...
    static propTypes = {
        drawerOpened: PropTypes.bool.isRequired,
        paths: PropTypes.object.isRequired,
    }


    // ...
    render = () =>
        <Drawer
            containerStyle={style}
            open={this.props.drawerOpened}
        >
            <Provide paths={this.props.paths} >
                <BalancesNavLink />
                <PaymentsNavLink />
                <AccountNavLink />
            </Provide>
        </Drawer>

}


//
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(BankDrawer)
