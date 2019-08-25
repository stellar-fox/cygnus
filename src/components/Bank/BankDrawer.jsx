import React, { Component } from "react"
import {
    bindActionCreators,
    compose,
} from "redux"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import { toBool } from "@xcmats/js-toolbox"
import {
    withDynamicRoutes,
    withStaticRouter,
} from "../StellarRouter"
import { Null } from "../../lib/utils"
import { bankDrawerWidth } from "../StellarFox/env"
import { action as BankAction } from "../../redux/Bank"
import { withStyles } from "@material-ui/core/styles"
import Badge from "@material-ui/core/Badge"
import Drawer from "@material-ui/core/Drawer"
import Divider from "../../lib/mui-v1/Divider"




const NavBadge = compose(
    withStyles((theme) => ({

        badge: {
            position: "relative",
            top: "10px",
            left: "-15px",
            background: theme.palette.danger,
            color: "white",
            fontWeight: 600,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
            opacity: "0.8",
        },
    }))
)(
    ({ classes, children, badgeContent }) =>
        <Badge classes={{badge: classes.badge }} color="secondary"
            badgeContent={badgeContent}
        >
            {children}
        </Badge>
)


// <NavLinkTemplate> component
const NavLinkTemplate = compose(
    withStyles({

        menuItem: {
            display: "block",
            lineHeight: "48px",
            minHeight: "48px",
            whiteSpace: "nowrap",
            paddingLeft: "10px",
            paddingRight: "10px",
            color: "rgba(244, 176, 4, 0.5)",
            "&:hover": {
                color: "rgba(244, 176, 4, 1)",
            },
        },

    }),
    withStaticRouter,
    withDynamicRoutes
)(
    ({
        classes,
        currentPath,
        staticRouter: { pushByView, getPath },
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
const PaymentsNavLink = ({ show }) =>
    show ? <NavLinkTemplate to="Payments" icon="payment" /> : <Null />




// <AccountNavLink> component
const AccountNavLink = () =>
    <NavLinkTemplate to="Account" icon="account_balance" />




// <ContactsLink> component
const ContactsNavLink = ({ show, showBadge, badgeContent }) =>
    show ?
        showBadge ?
            <NavBadge badgeContent={badgeContent}>
                <NavLinkTemplate to="Contacts" icon="contacts" />
            </NavBadge> : <NavLinkTemplate to="Contacts" icon="contacts" />
        : <Null />




// <BankDrawer> component
export default compose(
    withStyles((theme) => ({
        paper: {
            color: theme.palette.primary.other,
            borderTop: "1px solid #052f5f",
            borderBottom: "1px solid #052f5f",
            borderLeft: "1px solid #052f5f",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            backgroundColor: "#2e5077",
            height: "calc(100% - 94px)",
            top: 65,
            width: bankDrawerWidth,
        },

    })),
    connect(
        // map state to props.
        (state) => ({
            authenticated: state.Auth.authenticated,
            accountExists: toBool(state.StellarAccount.accountId),
            drawerVisible: state.Bank.drawerVisible,
            contactRequests: state.Contacts.requests,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
        }),
        (dispatch) => bindActionCreators({

            toggleDrawer: BankAction.toggleDrawer,

        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            accountExists: PropTypes.bool.isRequired,
            drawerVisible: PropTypes.bool.isRequired,
        }


        // ...
        render = () => (
            ({
                authenticated, classes, drawerVisible, accountExists,
                contactRequests, toggleDrawer,
            }) =>
                <Drawer
                    variant="persistent"
                    classes={{
                        paper: classes.paper,

                    }}
                    open={drawerVisible}
                    onClose={toggleDrawer}
                >
                    <BalancesNavLink />
                    <PaymentsNavLink show={accountExists} />
                    <AccountNavLink />
                    <Divider />
                    <ContactsNavLink
                        show={authenticated}
                        showBadge={contactRequests.length > 0}
                        badgeContent={contactRequests.length}
                    />

                </Drawer>
        )(this.props)

    }
)
