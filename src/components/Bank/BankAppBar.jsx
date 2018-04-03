import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { swap } from "../../lib/utils"

import {
    logOut,
    openDrawer,
    closeDrawer,
    changeLoginState,
    ActionConstants,
} from "../../redux/actions"

import AppBar from "material-ui/AppBar"
import IconButton from "material-ui/IconButton"
import BankAppBarTitle from "./BankAppBarTitle"
import BankAppBarItems from "./BankAppBarItems"




// ...
const style = {
    appBar : {
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10001,
    },
    icon : {
        color: "rgba(15, 46, 83, 0.45)",
    },
}




// <BankAppBar> component
class BankAppBar extends Component {

    // ...
    drawerToggle = () =>
        this.props.drawerOpened ?
            this.props.closeDrawer() :
            this.props.openDrawer()


    // ...
    handleLogOutClick = () => {
        this.props.changeLoginState({
            loginState: ActionConstants.LOGGED_OUT,
            publicKey: null,
            bip32Path: null,
            userId: null,
            token: null,
        })
        this.props.logOut()
        sessionStorage.clear()
    }


    // route mapping (replace keys with values on paths object)
    routeToViewMap = swap(this.props.paths)


    // ...
    render = () =>
        <AppBar
            title={
                <div className="flex-row">
                    <BankAppBarTitle
                        viewName={this.routeToViewMap[this.props.currentPath]}
                    />
                    <BankAppBarItems />
                </div>
            }
            className="navbar"
            style={style.appBar}
            onLeftIconButtonClick={this.drawerToggle}
            iconElementRight={
                <IconButton
                    iconStyle={style.icon}
                    onClick={this.handleLogOutClick}
                >
                    <i className="material-icons">power_settings_new</i>
                </IconButton>
            }
        />

}


// ...
export default connect(
    // map state to props.
    (state) => ({
        drawerOpened: state.ui.drawer.isOpened,
        currentPath: state.router.location.pathname,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        logOut,
        openDrawer,
        closeDrawer,
        changeLoginState,
    }, dispatch)
)(BankAppBar)
