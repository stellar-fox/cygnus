import React, { Component } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import {
    changeLoginState,
    logOut,
    resetUiState,
    ActionConstants,
} from "../../redux/actions"
import { action as AccountAction } from "../../redux/Account"
import { action as BankAction } from "../../redux/Bank"

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
export default connect(
    // map state to props.
    (state) => ({
        currentView: state.Router.currentView,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeLoginState,
        logOut,
        resetAccountState: AccountAction.resetState,
        resetUiState,
        toggleDrawer: BankAction.toggleDrawer,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            currentView: PropTypes.string.isRequired,
            changeLoginState: PropTypes.func.isRequired,
            logOut: PropTypes.func.isRequired,
            resetUiState: PropTypes.func.isRequired,
            toggleDrawer: PropTypes.func.isRequired,
        }


        // ...
        handleLogOutClick = () => {
            this.props.changeLoginState({
                loginState: ActionConstants.LOGGED_OUT,
                publicKey: null,
                bip32Path: null,
                userId: null,
                token: null,
            })
            this.props.resetUiState()
            this.props.resetAccountState()
            this.props.logOut()
            sessionStorage.clear()
        }


        // ...
        render = () => (
            ({ currentView, toggleDrawer, }) =>
                <AppBar
                    title={
                        <div className="flex-row">
                            <BankAppBarTitle viewName={currentView} />
                            <BankAppBarItems />
                        </div>
                    }
                    className="navbar"
                    style={style.appBar}
                    onLeftIconButtonClick={toggleDrawer}
                    iconElementRight={
                        <IconButton
                            iconStyle={style.icon}
                            onClick={this.handleLogOutClick}
                        >
                            <i className="material-icons">
                                power_settings_new
                            </i>
                        </IconButton>
                    }
                />
        )(this.props)

    }
)
