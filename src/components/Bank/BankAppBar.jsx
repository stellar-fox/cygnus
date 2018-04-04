import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import {
    swap,
    shallowEquals,
} from "../../lib/utils"

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
    static propTypes = {
        paths: PropTypes.object.isRequired,
        currentPath: PropTypes.string.isRequired,
        drawerOpened: PropTypes.bool.isRequired,
        logOut: PropTypes.func.isRequired,
        openDrawer: PropTypes.func.isRequired,
        closeDrawer: PropTypes.func.isRequired,
        changeLoginState: PropTypes.func.isRequired,
    }


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


    // ...
    state = {
        paths: this.props.paths,
        // route mapping (keys with values on paths object replaced)
        routeToViewMap: swap(this.props.paths),
    }


    // ...
    static getDerivedStateFromProps = (nextProps, prevState) =>
        !shallowEquals(nextProps.paths, prevState.paths) ? {
            paths: nextProps.paths,
            routeToViewMap: swap(nextProps.paths),
        } : null


    // ...
    render = () =>
        <AppBar
            title={
                <div className="flex-row">
                    <BankAppBarTitle
                        viewName={this.state.routeToViewMap[this.props.currentPath]}
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
        paths: state.Router.paths,
    }),

    // map dispatch to props.
    (dispatch) => bindActionCreators({
        logOut,
        openDrawer,
        closeDrawer,
        changeLoginState,
    }, dispatch)
)(BankAppBar)
