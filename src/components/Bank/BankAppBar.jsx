import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"

import { action as AccountAction } from "../../redux/Account"
import { action as BankAction } from "../../redux/Bank"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { action as PaymentsAction } from "../../redux/Payments"

import { withStyles } from "material-ui-next/styles"
import AppBar from "material-ui-next/AppBar"
import IconButton from "material-ui-next/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import PowerIcon from "@material-ui/icons/PowerSettingsNew"
import Toolbar from "material-ui-next/Toolbar"
import Typography from "material-ui-next/Typography"

import BankAppBarTitle from "./BankAppBarTitle"
import BankAppBarItems from "./BankAppBarItems"




// <BankAppBar> component
export default compose(
    withStyles({

        appbar: {
            backgroundColor: "#F4B004",
            "@global h1": { color: "#0F2E53", },
            "@global svg": {
                fill: ["rgba(15, 46, 83, 0.45)", "!important",],
            },
        },

        flex: { flex: 1, },

        logoutButton: {
            marginLeft: 20,
            marginRight: -12,
        },

        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },

    }),
    connect(
        // map state to props.
        (state) => ({
            currentView: state.Router.currentView,
        }),
        // map dispatch to props.
        (dispatch) => bindActionCreators({
            resetAccountState: AccountAction.resetState,
            resetLedgerHQState: LedgerHQAction.resetState,
            resetLoginManagerState: LoginManagerAction.resetState,
            resetPaymentsState: PaymentsAction.resetState,
            resetStellarAccountState: StellarAccountAction.resetState,
            toggleDrawer: BankAction.toggleDrawer,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            currentView: PropTypes.string.isRequired,
            resetAccountState: PropTypes.func.isRequired,
            resetLedgerHQState: PropTypes.func.isRequired,
            resetLoginManagerState: PropTypes.func.isRequired,
            resetPaymentsState: PropTypes.func.isRequired,
            resetStellarAccountState: PropTypes.func.isRequired,
            toggleDrawer: PropTypes.func.isRequired,
        }


        // ...
        handleLogOutClick = () => {
            this.props.resetAccountState()
            this.props.resetLedgerHQState()
            this.props.resetLoginManagerState()
            this.props.resetPaymentsState()
            this.props.resetStellarAccountState()
        }


        // ...
        render = () => (
            ({ classes, currentView, toggleDrawer, }) =>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={classes.flex}
                        >
                            <div className="flex-row">
                                <BankAppBarTitle viewName={currentView} />
                                <BankAppBarItems />
                            </div>
                        </Typography>
                        <IconButton
                            className={classes.logoutButton}
                            color="inherit"
                            aria-label="Logout"
                            onClick={this.handleLogOutClick}
                        >
                            <PowerIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
        )(this.props)

    }
)
