import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import AppBar from "material-ui/AppBar"
import IconButton from "material-ui/IconButton"

import {
    logOut,
    openDrawer,
    closeDrawer,
    selectView,
    setLoginState,
    ActionConstants,
} from "../../actions/index"

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
        color: "rgba(15,46,83,0.45)",
    },
}




// ...
class BankAppBar extends Component {

    // ...
    handleToggle = () =>
        this.props.drawerOpened
            ? this.props.closeDrawer()
            : this.props.openDrawer()


    // ...
    handleLogOutClick = () => {
        this.props.setLoginState(ActionConstants.LOGGED_OUT)
        this.props.logOut()
        this.props.selectView(ActionConstants.VIEW_WELCOME)
        sessionStorage.clear()
    }


    // ...
    render = () =>
        <AppBar
            title={
                <div className="flex-row">
                    <BankAppBarTitle />
                    <BankAppBarItems />
                </div>
            }
            className="navbar"
            style={style.appBar}
            onLeftIconButtonClick={this.handleToggle}
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
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        logOut,
        openDrawer,
        closeDrawer,
        selectView,
        setLoginState,
    }, dispatch)
)(BankAppBar)
