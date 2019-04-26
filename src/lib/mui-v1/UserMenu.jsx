import React, { PureComponent, Fragment } from "react"
import { bindActionCreators, compose } from "redux"
import { connect } from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { IconButton, Menu, MenuItem } from "@material-ui/core"
import { gravatar, gravatarSize48 } from "../../components/StellarFox/env"
import Avatar from "@material-ui/core/Avatar"
import PowerIcon from "@material-ui/icons/PowerSettingsNew"
import { signOut } from "../../thunks/users"




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
class UserMenu extends PureComponent {

    state = {
        anchorEl: null,
    }


    // ...
    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget })
    }


    // ...
    handleClose = (_event, action) => {
        this.setState({ anchorEl: null })
        typeof action === "function" && action()
    }


    // ...
    logout = () => this.props.signOut()


    // ...
    render = () => {
        const { anchorEl } = this.state
        const { authenticated, classes, gravatarHash } = this.props

        return (
            <div className="f-b m-l-small">
                {authenticated ?
                    <Fragment>
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
                            classes={{ paper: classes.menu }}
                            id="user-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem classes={{ root: classes.menuItem }}
                                onClick={(event) =>
                                    this.handleClose(event, this.logout)}
                            >Logout</MenuItem>
                        </Menu>
                    </Fragment> :
                    <IconButton
                        color="inherit"
                        aria-label="Logout"
                        onClick={this.logout}
                    >
                        <PowerIcon />
                    </IconButton>
                }
            </div>
        )
    }
}




// ...
export default compose(
    connect(
        (state) => ({
            authenticated: state.Auth.authenticated,
            gravatarHash: state.Account.gravatar,
            publicKey: state.LedgerHQ.publicKey,
            bip32Path: state.LedgerHQ.bip32Path,
            token: state.LoginManager.token,
            userId: state.LoginManager.userId,
        }),
        (dispatch) => bindActionCreators({
            signOut,
        }, dispatch)
    ),
    withStyles(styles),
)(UserMenu)
