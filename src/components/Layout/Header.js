import React, { Component } from "react"
import { bindActionCreators } from "redux"
import {
    NavLink,
    withRouter,
} from "react-router-dom"
import { connect } from "react-redux"

import AppBar from "material-ui/AppBar"
import Drawer from "material-ui/Drawer"
import IconButton from "material-ui/IconButton"

import {
    logOutOfHorizon,
    logOut,
    openDrawer,
    closeDrawer,
    selectView,
} from "../../actions/index"

import AppBarTitle from "./AppBarTitle"
import AppBarItems from "./AppBarItems"

import "./Header.css"




// ...
class BalancesNavLinkCore extends Component {

    // ...
    constructor (props) {
        super(props)
        this.selectBalances = this.props.selectView.bind(this, "Balances")
    }


    // ...
    render () {
        return (
            <NavLink
                className="menu-item"
                onClick={this.selectBalances}
                exact
                activeClassName="active"
                to="/"
            >
                <i className="material-icons">account_balance_wallet</i>
                Balances
            </NavLink>
        )
    }

}


// ...
const BalancesNavLink = connect(
    // map state to props.
    (state) => ({
        path : state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(BalancesNavLinkCore)




// ...
class PaymentsNavLinkCore extends Component {

    // ...
    constructor (props) {
        super(props)
        this.selectPayments = this.props.selectView.bind(this, "Payments")
    }


    // ...
    render () {
        return this.props.accountInfo.exists ? (
            <NavLink
                className="menu-item"
                onClick={this.selectPayments}
                exact
                activeClassName="active"
                to="/payments/"
            >
                <i className="material-icons">payment</i>
                Payments
            </NavLink>
        ) : null
    }

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
    }, dispatch)
)(PaymentsNavLinkCore)




// ...
class AccountNavLinkCore extends Component {

    // ...
    constructor (props) {
        super(props)
        this.selectAccount = this.props.selectView.bind(this, "Account")
    }


    // ...
    render () {
        return (
            <NavLink
                className="menu-item"
                onClick={this.selectAccount}
                exact
                activeClassName="active"
                to="/account/"
            >
                <i className="material-icons">account_balance</i>
                Account
            </NavLink>
        )
    }

}


// ...
const AccountNavLink = connect(
    // map state to props.
    (state) => ({
        path : state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(AccountNavLinkCore)




// ...
class BankDrawerCore extends Component {

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
    render () {
        return (
            <Drawer
                containerStyle={BankDrawerCore.style}
                open={this.props.drawerOpened}
            >
                <BalancesNavLink />
                <PaymentsNavLink />
                <AccountNavLink />
            </Drawer>
        )
    }

}


// ...
export const BankDrawer = withRouter(connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(BankDrawerCore))




// ...
class BankAppBarCore extends Component {

    // ...
    static style = {
        appBar : {
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 10001,
        },
        icon : {
            color: "rgba(15,46,83,0.45)",
        },
    }


    // ...
    constructor (props) {
        super(props)
        this.handleToggle = this.handleToggle.bind(this)
        this.handleLogOutClick = this.handleLogOutClick.bind(this)
    }

    // ...
    handleToggle = () =>
        this.props.drawerOpened
            ? this.props.closeDrawer()
            : this.props.openDrawer()


    // ...
    handleLogOutClick () {
        this.props.logOutOfHorizon()
        this.props.logOut()
        this.props.selectView("/")
        sessionStorage.clear()
    }


    // ...
    render () {
        return (
            <AppBar
                title={
                    <div className="flex-row">
                        <AppBarTitle />
                        <AppBarItems />
                    </div>
                }
                className="navbar"
                style={BankAppBarCore.style.appBar}
                onLeftIconButtonClick={this.handleToggle}
                iconElementRight={
                    <IconButton
                        iconStyle={BankAppBarCore.style.icon}
                        onClick={this.handleLogOutClick}
                    >
                        <i className="material-icons">power_settings_new</i>
                    </IconButton>
                }
            />
        )
    }

}


// ...
export const BankAppBar = connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        logOutOfHorizon,
        logOut,
        openDrawer,
        closeDrawer,
        selectView,
    }, dispatch)
)(BankAppBarCore)
