import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { IconButton, Menu, MenuItem } from "@material-ui/core"
import { gravatar, gravatarSize48 } from "../../components/StellarFox/env"
import Avatar from "@material-ui/core/Avatar"

import { action as AccountAction } from "../../redux/Account"
import { action as AssetsAction } from "../../redux/AssetManager"
import { action as BalancesAction } from "../../redux/Balances"
import { action as ContactsAction } from "../../redux/Contacts"
import { action as LedgerHQAction } from "../../redux/LedgerHQ"
import { action as LoginManagerAction } from "../../redux/LoginManager"
import { action as StellarAccountAction } from "../../redux/StellarAccount"
import { action as PaymentsAction } from "../../redux/Payments"



// ...
const styles = theme => ({
    menu: {
        backgroundColor: theme.palette.secondary.light,
    },
    menuItem: {
        color: theme.palette.primary.light,
    },
})




// ...
class UserMenu extends Component {

    state = {
        anchorEl: null,
    }


    // ...
    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget, })
    }


    // ...
    handleClose = (_event, action) => {
        this.setState({ anchorEl: null, })
        typeof action === "function" && action()
    }


    // ...
    logout = () => {
        this.props.resetAccountState()
        this.props.resetAssetsState()
        this.props.resetBalancesState()
        this.props.resetContactsState()
        this.props.resetLedgerHQState()
        this.props.resetLoginManagerState()
        this.props.resetPaymentsState()
        this.props.resetStellarAccountState()
    }


    // ...
    render = () => {
        const { anchorEl, } = this.state
        const { classes, gravatarHash, } = this.props

        return (
            <div className="f-b m-l-small">
                <IconButton
                    aria-owns={anchorEl ? "user-menu" : null}
                    aria-haspopup="true"
                    onClick={this.openMenu}
                    color="inherit"
                >
                    <Avatar className={classes.avatar}
                        src={`${gravatar}${gravatarHash}?${
                            gravatarSize48}&d=robohash`}
                    />
                </IconButton>
                <Menu
                    classes={{ paper: classes.menu, }}
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem classes={{ root: classes.menuItem, }}
                        onClick={(event) =>
                            this.handleClose(event, this.logout)}
                    >Logout</MenuItem>
                </Menu>
            </div>
        )
    }
}




// ...
UserMenu.propTypes = {
    classes: PropTypes.object.isRequired,
}




// ...
export default compose(
    connect(
        (state) => ({
            gravatarHash: state.Account.gravatar,
        }),
        (dispatch) => bindActionCreators({
            resetAccountState: AccountAction.resetState,
            resetAssetsState: AssetsAction.resetState,
            resetBalancesState: BalancesAction.resetState,
            resetContactsState: ContactsAction.resetState,
            resetLedgerHQState: LedgerHQAction.resetState,
            resetLoginManagerState: LoginManagerAction.resetState,
            resetPaymentsState: PaymentsAction.resetState,
            resetStellarAccountState: StellarAccountAction.resetState,
        }, dispatch)
    ),
    withStyles(styles)
)(UserMenu)
