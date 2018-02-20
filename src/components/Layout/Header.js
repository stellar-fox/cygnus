import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"
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
    flatten,
    pubKeyAbbr,
    handleException,
} from "../../lib/utils"

import AppBarTitle from "./AppBarTitle"
import AppBarItems from "./AppBarItems"

import "./Header.css"




// ...
class Header extends Component {

    // ...
    handleToggle () {
        this.props.ui.drawer.isOpened
            ? this.props.closeDrawer()
            : this.props.openDrawer()
    }


    // ...
    handleMenuClick (view, _obj) {
        this.props.selectView(view)
        setTimeout(() => this.props.closeDrawer(), 300)
    }


    // ...
    handleLogOutClick (_state) {
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
    renderDrawer (key) {
        const renderNavLink = (key, onClick, toPath, icon, label) => [
            <NavLink
                key={key}
                className="menu-item"
                onClick={onClick}
                exact
                activeClassName="active"
                to={toPath}
            >
                <i className="material-icons">{icon}</i>
                {label}
            </NavLink>,
        ]

        return (
            <Drawer
                key={key}
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
                {flatten([
                    renderNavLink(
                        1,
                        this.handleMenuClick.bind(this, "Balances"),
                        "/",
                        "account_balance_wallet",
                        "Balances"
                    ),
                    this.props.accountInfo.exists ?
                        renderNavLink(
                            2,
                            this.handleMenuClick.bind(this, "Payments"),
                            "/payments/",
                            "payment",
                            "Payments"
                        ) : [],
                    renderNavLink(
                        3,
                        this.handleMenuClick.bind(this, "Account"),
                        "/account/",
                        "account_balance",
                        "Account"
                    ),
                ])}
            </Drawer>
        )
    }


    // ...
    render () {
        return (
            <Fragment>{[
                this.renderAppBar(1),
                this.renderDrawer(2),
            ]}</Fragment>
        )
    }
}




// ...
export default connect(
    // mapStateToProps
    (state) => ({
        accountInfo: state.accountInfo,
        auth: state.auth,
        nav: state.nav,
        ui: state.ui,
    }),

    // matchDispatchToProps
    (dispatch) => bindActionCreators({
        logOutOfHorizon,
        logOut,
        openDrawer,
        closeDrawer,
        selectView,
    }, dispatch)
)(Header)
