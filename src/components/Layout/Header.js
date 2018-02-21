import React, { Component, Fragment } from "react"
import { bindActionCreators } from "redux"
import { NavLink, withRouter } from "react-router-dom"
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

import {
    pubKeyAbbr,
    handleException,
} from "../../lib/utils"

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
const BalancesNavLink = withRouter(connect(
    // map state to props.
    null,

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(BalancesNavLinkCore))




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
const PaymentsNavLink = withRouter(connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(PaymentsNavLinkCore))




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
const AccountNavLink = withRouter(connect(
    // map state to props.
    null,

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(AccountNavLinkCore))




// ...
class WalletDrawerCore extends Component {

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
                containerStyle={WalletDrawerCore.style}
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
const WalletDrawer = withRouter(connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
    })
)(WalletDrawerCore))




// ...
class WalletAppBarCore extends Component {

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
                        <AppBarItems
                            accountTitle={
                                this.props.accountInfo.exists === true &&
                                this.props.accountInfo.account.account
                                    .home_domain ? (
                                        <div className="account-home-domain">
                                            {
                                                this.props.accountInfo.account
                                                    .account.home_domain
                                            }
                                        </div>
                                    ) : (
                                        <div>Account Number</div>
                                    )
                            }
                            accountNumber={
                                handleException(
                                    () => pubKeyAbbr(this.props.accountInfo.pubKey),
                                    (_) => "XXXXXX-XXXXXX"
                                )
                            }
                        />
                    </div>
                }
                className="navbar"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                }}
                onLeftIconButtonClick={this.handleToggle}
                iconElementRight={
                    <IconButton
                        iconStyle={{ color: "rgba(15,46,83,0.45)", }}
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
const WalletAppBar = withRouter(connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
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
)(WalletAppBarCore))




// ...
class Header extends Component {

    // ...
    render () {
        return (
            <Fragment>
                <WalletAppBar />
                <WalletDrawer />
            </Fragment>
        )
    }
}


// ...
export default withRouter(Header)
