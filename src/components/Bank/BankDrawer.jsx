import React, { Component } from "react"
import PropTypes from "prop-types"
import { compose } from "redux"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import {
    withDynamicRoutes,
    withStaticRouter
} from "../StellarRouter"
import { Null } from "../../lib/utils"
import { bankDrawerWidth } from "../StellarFox/env"

import { withStyles } from "@material-ui/core/styles"
import Drawer from "material-ui/Drawer"
import Divider from "../../lib/mui-v1/Divider"




// <NavLinkTemplate> component
const NavLinkTemplate = compose(
    withStyles({

        menuItem: {
            display: "block",
            lineHeight: "48px",
            minHeight: "48px",
            whiteSpace: "nowrap",
            paddingLeft: "10px",
            color: "rgba(244, 176, 4, 0.5)",
            "&:hover": {
                backgroundColor: "rgba(244, 176, 4, 0.15)",
            },
        },

    }),
    withStaticRouter,
    withDynamicRoutes
)(
    ({
        classes,
        currentPath,
        staticRouter: { pushByView, getPath, },
        to, icon,
    }) =>
        <NavLink
            className={classes.menuItem}
            onClick={(e) => {
                e.preventDefault()
                if (!currentPath.startsWith(getPath(to))) { pushByView(to) }
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
    show ? <NavLinkTemplate to="Payments" icon="payment" /> : <Null />




// <AccountNavLink> component
const AccountNavLink = () =>
    <NavLinkTemplate to="Account" icon="account_balance" />




// <ContactsLink> component
const ContactsNavLink = ({ show, }) =>
    show ? <NavLinkTemplate to="Contacts" icon="contacts" /> : <Null />




// ...
const bankDrawerStyle = {
    width: bankDrawerWidth,
    height: "calc(100% - 94px)",
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
        accountExists: !!state.StellarAccount.accountId,
        drawerVisible: state.Bank.drawerVisible,
    })
)(
    class extends Component {

        // ...
        static propTypes = {
            accountExists: PropTypes.bool.isRequired,
            drawerVisible: PropTypes.bool.isRequired,
        }


        // ...
        render = () => (
            ({ drawerVisible, accountExists, }) =>
                <Drawer
                    containerStyle={bankDrawerStyle}
                    open={drawerVisible}
                >
                    <BalancesNavLink />
                    <PaymentsNavLink show={accountExists} />
                    <AccountNavLink />
                    <Divider />
                    <ContactsNavLink show={true} />
                </Drawer>
        )(this.props)

    }
)
