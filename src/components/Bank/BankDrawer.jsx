import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import {
    withDynamicRoutes,
    withStaticRouter
} from "../StellarRouter"
import { bankDrawerWidth } from "../StellarFox/env"

import Drawer from "material-ui/Drawer"

import "./BankDrawer.css"




// <NavLinkTemplate> component
const NavLinkTemplate = compose(
    withStaticRouter,
    withDynamicRoutes
)(
    ({ currentPath, staticRouter: { pushByView, getPath, }, to, icon, }) =>
        <NavLink
            className="menu-item"
            onClick={(e) => {
                e.preventDefault()
                if (!currentPath.startsWith(getPath(to))) {
                    pushByView(to)
                }
            }}
            exact
            activeClassName="active"
            isActive={() => currentPath.startsWith(getPath(to))}
            to={getPath(to)}
        >
            <i className="material-icons">{icon}</i>{to}
        </NavLink>
)




// <BalancesNavLink> component
const BalancesNavLink = () =>
    <NavLinkTemplate to="Balances" icon="account_balance_wallet" />




// <PaymentsNavLink> component
const PaymentsNavLink = ({ show, }) =>
    show ? <NavLinkTemplate to="Payments" icon="payment" /> : null




// <AccountNavLink> component
const AccountNavLink = () =>
    <NavLinkTemplate to="Account" icon="account_balance" />




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
    // map state to props.
    (state) => ({
        accountInfo: state.accountInfo,
        drawerVisible: state.Bank.drawerVisible,
    })
)(
    class extends Component {

        // ...
        static propTypes = {
            accountInfo: PropTypes.object.isRequired,
            drawerVisible: PropTypes.bool.isRequired,
        }


        // ...
        render = () => (
            ({ drawerVisible, accountInfo, }) =>
                <Drawer
                    containerStyle={bankDrawerStyle}
                    open={drawerVisible}
                >
                    <BalancesNavLink />
                    <PaymentsNavLink show={accountInfo.exists} />
                    <AccountNavLink />
                </Drawer>
        )(this.props)

    }
)
