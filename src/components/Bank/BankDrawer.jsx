import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { push } from "react-router-redux"
import { bankDrawerWidth } from "../StellarFox/env"

import Drawer from "material-ui/Drawer"

import "./BankDrawer.css"




// <NavLinkTemplate> component
// with bound 'currentPath', 'paths' state props and 'push' dispatcher
const NavLinkTemplate = connect(
    (state) => ({
        currentPath: state.router.location.pathname,
        paths: state.Router.paths,
    }),
    (dispatch) => ({ push: (p) => dispatch(push(p)), })
)(({
    currentPath, paths, push, to, icon,
}) =>
    <NavLink
        className="menu-item"
        onClick={(e) => {
            e.preventDefault()
            if (!currentPath.startsWith(paths[to])) { push(paths[to]) }
        }}
        exact
        activeClassName="active"
        isActive={() => currentPath.startsWith(paths[to])}
        to={paths[to]}
    >
        <i className="material-icons">{icon}</i>
        {to}
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
    (state) => ({
        accountInfo: state.accountInfo,
        drawerOpened: state.ui.drawer.isOpened,
    })
)(
    class BankDrawer extends Component {

        // ...
        static propTypes = {
            accountInfo: PropTypes.object.isRequired,
            drawerOpened: PropTypes.bool.isRequired,
        }


        // ...
        render = () =>
            <Drawer
                containerStyle={bankDrawerStyle}
                open={this.props.drawerOpened}
            >
                <BalancesNavLink />
                <PaymentsNavLink show={this.props.accountInfo.exists} />
                <AccountNavLink />
            </Drawer>

    }
)
