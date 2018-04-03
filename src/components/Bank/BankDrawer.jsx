import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { push } from "react-router-redux"
import { bankDrawerWidth } from "../StellarFox/env"
import { Provide } from "../../lib/utils"

import Drawer from "material-ui/Drawer"

import "./BankDrawer.css"




// binds 'currentPath' state prop and 'push' dispatcher
const navLinkConnect = connect(
    (state) => ({ currentPath: state.router.location.pathname, }),
    (dispatch) => ({ push: (p) => dispatch(push(p)), })
)




// <BalancesNavLink> component
const BalancesNavLink = navLinkConnect(
    ({ currentPath, paths, push, }) =>
        <NavLink
            className="menu-item"
            onClick={(e) => {
                e.preventDefault()
                if (!currentPath.startsWith(paths.Balances)) {
                    push(paths.Balances)
                }
            }}
            exact
            activeClassName="active"
            isActive={() => currentPath.startsWith(paths.Balances)}
            to={paths.Balances}
        >
            <i className="material-icons">account_balance_wallet</i>
            Balances
        </NavLink>
)




// <PaymentsNavLink> component
const PaymentsNavLink = navLinkConnect(
    ({ currentPath, paths, push, }) =>
        <NavLink
            className="menu-item"
            onClick={(e) => {
                e.preventDefault()
                if (!currentPath.startsWith(paths.Payments)) {
                    push(paths.Payments)
                }
            }}
            exact
            isActive={() => currentPath.startsWith(paths.Payments)}
            activeClassName="active"
            to={paths.Payments}
        >
            <i className="material-icons">payment</i>
            Payments
        </NavLink>
)




// <AccountNavLink> component
const AccountNavLink = navLinkConnect(
    ({ currentPath, paths, push, }) =>
        <NavLink
            className="menu-item"
            onClick={(e) => {
                e.preventDefault()
                if (!currentPath.startsWith(paths.Account)) {
                    push(paths.Account)
                }
            }}
            exact
            isActive={() => currentPath.startsWith(paths.Account)}
            activeClassName="active"
            to={paths.Account}
        >
            <i className="material-icons">account_balance</i>
            Account
        </NavLink>
)




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
                    {
                        this.props.accountInfo.exists ?
                            <PaymentsNavLink /> : null
                    }
                    <AccountNavLink />
                </Provide>
            </Drawer>

    }
)
