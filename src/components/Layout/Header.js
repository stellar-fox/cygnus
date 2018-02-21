import React, { Component, Fragment } from "react"
import { NavLink, withRouter } from "react-router-dom"
import { bindActionCreators } from "redux"
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
    render () {
        return (
            <NavLink
                className="menu-item"
                onClick={this.props.onClick}
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
const BalancesNavLink = withRouter(BalancesNavLinkCore)




// ...
class PaymentsNavLinkCore extends Component {

    // ...
    render () {
        return this.props.accountInfo.exists ? (
            <NavLink
                className="menu-item"
                onClick={this.props.onClick}
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
    })
)(PaymentsNavLinkCore))




// ...
class AccountNavLinkCore extends Component {

    // ...
    render () {
        return (
            <NavLink
                className="menu-item"
                onClick={this.props.onClick}
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
const AccountNavLink = withRouter(AccountNavLinkCore)




// ...
class WalletDrawerCore extends Component {

    // ...
    render () {
        return (
            <Drawer
                containerStyle={{
                    width: 180,
                    height: "calc(100% - 100px)",
                    top: 65,
                    borderTop: "1px solid #052f5f",
                    borderBottom: "1px solid #052f5f",
                    borderLeft: "1px solid #052f5f",
                    borderTopRightRadius: "3px",
                    borderBottomRightRadius: "3px",
                    backgroundColor: "#2e5077",
                }}
                open={this.props.ui.drawer.isOpened}
            >
                <BalancesNavLink
                    onClick={this.props.selectView.bind(this, "Balances")}
                />
                <PaymentsNavLink
                    onClick={this.props.selectView.bind(this, "Payments")}
                />
                <AccountNavLink
                    onClick={this.props.selectView.bind(this, "Account")}
                />
            </Drawer>
        )
    }

}


// ...
const WalletDrawer = withRouter(connect(
    // map state to props.
    (state) => ({
        ui: state.ui,
    }),

    // match dispatch to props.
    (dispatch) => bindActionCreators({
        selectView,
    }, dispatch)
)(WalletDrawerCore))




// ...
class Header extends Component {

    // ...
    handleToggle = () =>
        this.props.ui.drawer.isOpened
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
    renderAppBar (key) {
        return (
            <AppBar
                key={key}
                title={
                    <div className="flex-row">
                        <AppBarTitle
                            title={<span>Stellar Fox</span>}
                            subtitle={this.props.nav.view}
                            network={<div className="badge">test net</div>}
                            ledgerUsed={
                                this.props.auth.ledgerSoftwareVersion ? (
                                    <span className="ledger-nano-s"></span>
                                ) : null
                            }
                        />
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
                onLeftIconButtonClick={this.handleToggle.bind(this)}
                iconElementRight={
                    <IconButton
                        iconStyle={{ color: "rgba(15,46,83,0.45)", }}
                        onClick={this.handleLogOutClick.bind(this, false)}
                    >
                        <i className="material-icons">power_settings_new</i>
                    </IconButton>
                }
            />
        )
    }


    // ...
    render () {
        return (
            <Fragment>
                {this.renderAppBar(1)}
                <WalletDrawer />
            </Fragment>
        )
    }
}


// ...
export default withRouter(connect(
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
        auth: state.auth,
        nav: state.nav,
        ui: state.ui,
    }),

    // match dispatch to props.
    (dispatch) => bindActionCreators({
        logOutOfHorizon,
        logOut,
        openDrawer,
        closeDrawer,
        selectView,
    }, dispatch)
)(Header))
