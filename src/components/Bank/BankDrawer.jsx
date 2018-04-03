import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { push } from "react-router-redux"
import { bankDrawerWidth } from "../StellarFox/env"
import { Provide } from "../../lib/utils"

import Drawer from "material-ui/Drawer"

import "./BankDrawer.css"




// <NavLinkTemplate> component
// with bound 'currentPath' state prop and 'push' dispatcher
const NavLinkTemplate = connect(
    (state) => ({ currentPath: state.router.location.pathname, }),
    (dispatch) => ({ push: (p) => dispatch(push(p)), })
)(({
    currentPath, push, to, icon, label,
}) =>
    <NavLink
        className="menu-item"
        onClick={(e) => {
            e.preventDefault()
            if (!currentPath.startsWith(to)) { push(to) }
        }}
        exact
        activeClassName="active"
        isActive={() => currentPath.startsWith(to)}
        to={to}
    >
        <i className="material-icons">{icon}</i>
        {label}
    </NavLink>
)




// <BalancesNavLink> component
const BalancesNavLink = ({ paths, }) =>
    <NavLinkTemplate
        to={paths.Balances}
        icon="account_balance_wallet"
        label="Balances"
    />




// <PaymentsNavLink> component
const PaymentsNavLink = ({ show, paths, }) =>
    show ?
        <NavLinkTemplate
            to={paths.Payments}
            icon="payment"
            label="Payments"
        /> : null




// <AccountNavLink> component
const AccountNavLink = ({ paths, }) =>
    <NavLinkTemplate
        to={paths.Account}
        icon="account_balance"
        label="Account"
    />




// ...
const bankDrawerStyle = {
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




// <BankDrawer> component
export default connect(
    (state) => ({
        accountInfo: state.accountInfo,
        drawerOpened: state.ui.drawer.isOpened,
    })
)(
    class BankDrawer extends Component {

        // ...
        static propTypes = {
            drawerOpened: PropTypes.bool.isRequired,
            paths: PropTypes.object.isRequired,
        }


        // ...
        render = () =>
            <Drawer
                containerStyle={bankDrawerStyle}
                open={this.props.drawerOpened}
            >
                <Provide paths={this.props.paths}>
                    <BalancesNavLink />
                    <PaymentsNavLink show={this.props.accountInfo.exists} />
                    <AccountNavLink />
                </Provide>
            </Drawer>

    }
)
