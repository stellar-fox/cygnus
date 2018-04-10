import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { changeSnackbarState } from "../../redux/actions"

import Snackbar from "../../lib/common/Snackbar"




// <ConnectedSnackbar> component
export default connect(
    // map state to props.
    (state) => ({ appUi: state.appUi, }),
    // map dispatch to props.
    (dispatch) => bindActionCreators({
        changeSnackbarState,
    }, dispatch)
)(
    class extends Component {

        // ...
        static propTypes = {
            appUi: PropTypes.object.isRequired,
            changeSnackbarState: PropTypes.func.isRequired,
        }


        // ...
        onDismiss = () => this.props.changeSnackbarState({
            open: false, message: "",
        })


        // ...
        render = () => (
            ({ snackbar, }) =>
                <Snackbar
                    open={snackbar.open}
                    onRequestClose={this.onDismiss}
                    message={snackbar.message}
                />
        )(this.props.appUi)
    }
)
