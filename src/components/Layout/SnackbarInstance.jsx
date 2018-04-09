import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Snackbar from "../../lib/common/Snackbar"

import {
    changeSnackbarState,
} from "../../redux/actions"




// ...
const SnackbarInstance = ({ open, onRequestClose, message, }) =>
    <Snackbar
        open={open}
        message={message}
        onRequestClose={onRequestClose}
    />




// <Snackbar> Instance
export default connect(
    // map state to props.
    (state) => ({
        appUi: state.appUi,
    }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeSnackbarState,
    }, dispatch)
)(
    class extends Component {

        // ...
        onDismiss = () => this.props.changeSnackbarState({
            open: false, message: "",
        })

        // ...
        render = () => (
            ({ snackbar, }) =>
                <SnackbarInstance
                    open={snackbar.open}
                    onRequestClose={this.onDismiss}
                    message={snackbar.message}
                />
        )(this.props.appUi)
    }
)
