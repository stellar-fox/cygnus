import React, { Component } from "react"
import PropTypes from "prop-types"
import {
    bindActionCreators,
    compose,
} from "redux"
import { connect } from "react-redux"

import { action as BankAction } from "../../redux/Bank"

import { withStyles } from "@material-ui/core/styles"
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

import BankAppBarTitle from "./BankAppBarTitle"
import BankAppBarItems from "./BankAppBarItems"
import UserMenu from "../../lib/mui-v1/UserMenu"
import { withLoginManager } from "../LoginManager"




// <BankAppBar> component
export default compose(
    withLoginManager,
    withStyles({

        appbar: {
            backgroundColor: "#F4B004",
            "@global h1": { color: "#0F2E53", },
            "@global svg": {
                fill: ["rgba(15, 46, 83, 0.45)", "!important",],
            },
        },

        flex: { flex: 1, },

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
            toggleDrawer: BankAction.toggleDrawer,
        }, dispatch)
    )
)(
    class extends Component {

        // ...
        static propTypes = {
            classes: PropTypes.object.isRequired,
            currentView: PropTypes.string.isRequired,
            toggleDrawer: PropTypes.func.isRequired,
        }


        // ...
        render = () => (
            ({ classes, currentView, toggleDrawer, loginManager, }) =>
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
                        { loginManager.isAuthenticated() && <UserMenu /> }
                    </Toolbar>
                </AppBar>
        )(this.props)

    }
)
